# Standard de travail SanimarcInc

S'applique à **tous les repos** et à **tout le monde**, humain ou AI.

## 1. Tout commence par une issue

Avant de coder, il y a une issue qui décrit le besoin. Son numéro se retrouve dans la branche, la PR et les commits.

## 2. Branches

### Branches permanentes
| Branche | Rôle |
|---|---|
| `main` | Ce qui est en production. On n'y pousse jamais directement. |
| `dev` | (optionnel) Intégration avant la mise en prod. |

Les repos qui ont des environnements dédiés (`demo`, `prod`, `test`) les gardent, mais on y arrive toujours par PR.

### Branches de travail
```
<type>/<no-issue>-<description-courte>
```
- `type` : `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `perf`, `hotfix`
- `no-issue` : numéro de l'issue GitHub
- `description-courte` : minuscules, mots séparés par des tirets, sans accents

Exemples : `feat/142-filtre-livrables`, `fix/158-acces-membres`, `docs/12-readme`

Pour regrouper un lot de mise en prod : `release/AAAA-MM-JJ` (ex. `release/2026-11-10`).

Plus de `feature/`, `correctif/`, `claude/nom-au-hasard`, `quickfix` ou de noms sans préfixe.

## 3. Commits : Conventional Commits

```
<type>(<portée optionnelle>): <description> (#<no-issue>)
```
Exemples : `feat(projet): filtre multiple des livrables (#142)`, `fix(acces): un membre nommé voit le projet (#158)`

## 4. Pull requests

- **Titre** : même format que les commits, ex. `feat(projet): filtre multiple des livrables (#142)`. Pas de titre généré automatiquement du genre « Feature/dialogs » ou « Dev ».
- **Description** : le template est rempli au complet, aucune section vide.
- **Issue liée** : `Closes #142` dans la description.
- Une PR = un sujet. Pour mettre une branche à jour, on fait un `git rebase` ou un `git merge` local, pas une PR de `main` vers la branche.
- La branche est supprimée après le merge.

### Étiquettes
- Type : `bug`, `enhancement`, `documentation`, `securite`, `dette-technique` (`dependencies` est réservé à Dependabot)
- Priorité : `p1-urgent`, `p2-important`, `p3-normal`
- Autres : `agent-ai` (ajoutée automatiquement aux PR faites par un agent), `bloque`

### Automatique sur chaque PR
- **pr-guard** vérifie le standard (branche, titre, description, issue liée).
- **CI** compile et lance les tests, selon la stack du repo. On ne merge pas une PR dont la CI est rouge. Les agents attendent la fin de la CI et corrigent eux-mêmes avant de dire que c'est fini.
- **Dependabot** ouvre chaque lundi des PR de mise à jour des dépendances, et tout de suite pour une faille de sécurité.

## 5. Règles pour les agents AI

Les agents (Claude Code, Codex, Copilot, Cursor…) suivent exactement le même standard. En plus :

1. **Une issue pour chaque chose, sans exception.** L'agent cherche si l'issue existe, la crée sinon (`gh issue create`) avec contexte, objectif et critères d'acceptation, et se l'assigne. Une demande avec plusieurs sujets = plusieurs issues.
2. **L'agent gère ses issues lui-même** : il coche les critères au fur et à mesure, commente les décisions et les blocages, et ferme l'issue avec une explication si le travail est abandonné.
3. **Un problème découvert en chemin** devient une nouvelle issue. Il n'est pas corrigé dans la même PR.
4. **Nommer la branche** selon la section 2, jamais avec un nom aléatoire.
5. **Documenter sur l'issue** : un commentaire à la création de la branche (nom de la branche et plan), puis un à l'ouverture de la PR.
6. **Remplir la PR au complet** : titre au format, toutes les sections du template, `Closes #`.
7. **Ne jamais pousser directement** sur `main`, `master`, `dev`, `demo` ou `prod`.
8. **Ne jamais commiter de secret** (`.env`, mot de passe, clé, token).
9. **Tenir la fiche du repo à jour** (description, site web, sujets) et le README, chaque fois qu'une PR change le but, la stack ou l'URL du repo.

Le détail des instructions que suivent les agents est dans [`templates/AGENTS.md`](templates/AGENTS.md).

## 6. Identité git

Chaque dev utilise le même nom et le même courriel sur tous ses postes :
```
git config --global user.name  "Prénom Nom"
git config --global user.email "<ton courriel de travail>"
```
Le courriel doit être ajouté à ton compte GitHub (Settings → Emails) pour que les commits te soient associés.
