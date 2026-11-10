// Synchronise toutes les issues et PR de l'organisation dans le GitHub Project (Kanban).
// Utilisé par .github/workflows/project-sync.yml, et lançable en local :
//   GH_TOKEN=... node .github/scripts/project-sync.js [jours]
// ATTENTION : ce repo est public. Le script ne journalise que des compteurs, jamais de titres ni de noms de repos privés.

const ORG = 'SanimarcInc';
const PROJECT_NUMBER = 3;
const STATUS = { todo: 'À faire', doing: 'En cours', review: 'En revue', done: 'Fait' };
const SOURCE = { ai: 'Agent AI', human: 'Humain' };

async function run(gql, { days = 14 } = {}) {
  // 1. Project, champs et options
  const p = (await gql(`query($o:String!,$n:Int!){organization(login:$o){projectV2(number:$n){id
    fields(first:50){nodes{... on ProjectV2SingleSelectField{id name options{id name}}}}}}}`,
    { o: ORG, n: PROJECT_NUMBER })).organization.projectV2;
  const field = (name) => p.fields.nodes.find((f) => f && f.name === name);
  const opt = (f, name) => f.options.find((o) => o.name === name).id;
  const fStatus = field('Status');
  const fSource = field('Source');

  // 2. Items : tout ce qui est ouvert + ce qui a été fermé dans les N derniers jours
  const since = new Date(Date.now() - days * 864e5).toISOString().slice(0, 10);
  const queries = [`org:${ORG} is:open`, `org:${ORG} is:closed closed:>=${since}`];
  const items = new Map();
  for (const q of queries) {
    for (const type of ['ISSUE', 'PR']) {
      let after = null;
      do {
        const r = (await gql(`query($q:String!,$a:String){search(type:ISSUE,query:$q,first:100,after:$a){
          pageInfo{hasNextPage endCursor}
          nodes{__typename
            ... on Issue{id state assignees(first:1){totalCount}}
            ... on PullRequest{id state isDraft body headRefName
              commits(last:30){nodes{commit{message author{name}}}}}}}}`,
          { q: `${q} ${type === 'PR' ? 'is:pr' : 'is:issue'}`, a: after })).search;
        for (const n of r.nodes) if (n && n.id) items.set(n.id, n);
        after = r.pageInfo.hasNextPage ? r.pageInfo.endCursor : null;
      } while (after);
    }
  }

  // 3. Ajout au Project et mise à jour des champs
  const counts = { total: 0, [STATUS.todo]: 0, [STATUS.doing]: 0, [STATUS.review]: 0, [STATUS.done]: 0, ai: 0, errors: 0 };
  for (const n of items.values()) {
    try {
      const itemId = (await gql(`mutation($p:ID!,$c:ID!){addProjectV2ItemById(input:{projectId:$p,contentId:$c}){item{id}}}`,
        { p: p.id, c: n.id })).addProjectV2ItemById.item.id;

      let status;
      if (n.__typename === 'Issue') {
        status = n.state === 'OPEN' ? (n.assignees.totalCount > 0 ? STATUS.doing : STATUS.todo) : STATUS.done;
      } else {
        status = n.state === 'OPEN' ? (n.isDraft ? STATUS.doing : STATUS.review) : STATUS.done;
      }
      await setSelect(gql, p.id, itemId, fStatus.id, opt(fStatus, status));
      counts[status]++;

      if (n.__typename === 'PullRequest' && fSource) {
        const ai = isAi(n);
        if (ai) counts.ai++;
        await setSelect(gql, p.id, itemId, fSource.id, opt(fSource, ai ? SOURCE.ai : SOURCE.human));
      }
      counts.total++;
    } catch (e) {
      counts.errors++;
    }
  }
  return counts;
}

function isAi(pr) {
  if (/-\s*\[x\]\s*Généré ou modifié par un agent AI/i.test(pr.body || '')) return true;
  if (/^claude\//.test(pr.headRefName || '')) return true;
  return (pr.commits?.nodes || []).some(({ commit }) =>
    /co-authored-by:\s*(claude|copilot|codex|cursor)/i.test(commit.message || '') ||
    /^(claude|copilot|codex)/i.test(commit.author?.name || ''));
}

function setSelect(gql, projectId, itemId, fieldId, optionId) {
  return gql(`mutation($p:ID!,$i:ID!,$f:ID!,$o:String!){updateProjectV2ItemFieldValue(input:{projectId:$p,itemId:$i,fieldId:$f,value:{singleSelectOptionId:$o}}){projectV2Item{id}}}`,
    { p: projectId, i: itemId, f: fieldId, o: optionId });
}

module.exports = { run };

// Exécution locale
if (require.main === module) {
  const token = process.env.GH_TOKEN;
  const days = Number(process.argv[2] || 14);
  const gql = async (query, variables) => {
    const r = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables }),
    });
    const j = await r.json();
    if (j.errors) throw new Error(JSON.stringify(j.errors));
    return j.data;
  };
  run(gql, { days }).then((c) => console.log(JSON.stringify(c))).catch((e) => { console.error(e.message); process.exit(1); });
}
