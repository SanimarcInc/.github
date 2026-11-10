# SanimarcInc/.github

Standard de travail de l'organisation. Le détail est dans [`CONTRIBUTING.md`](CONTRIBUTING.md).

## Fichiers par défaut
Tout repo qui n'a pas ses propres fichiers en hérite automatiquement :

- `.github/pull_request_template.md` : template de PR
- `.github/ISSUE_TEMPLATE/` : formulaires d'issue (bug, fonctionnalité, tâche)
- `CONTRIBUTING.md` : le standard (issues, branches, commits, PR, agents AI)

## Workflows réutilisables (`.github/workflows/`)

| Workflow | Rôle | Appel depuis un repo |
|---|---|---|
| `pr-guard.yml` | Vérifie branche, titre, description et issue liée ; étiquette `agent-ai` | `templates/pr-guard.yml` |
| `claude.yml` | *(non activé : pas de clé API)* Revue de code automatique des PR par Claude, et réponse aux mentions `@claude` | `templates/claude.yml` (secret `ANTHROPIC_API_KEY`) |
| `ci-dotnet.yml` | restore, build, test .NET | `uses: SanimarcInc/.github/.github/workflows/ci-dotnet.yml@main` |
| `ci-node.yml` | install, lint, test, build Node | `uses: SanimarcInc/.github/.github/workflows/ci-node.yml@main` |
| `ci-php.yml` | syntaxe PHP, composer, tests Laravel en option | `uses: SanimarcInc/.github/.github/workflows/ci-php.yml@main` |
| `release.yml` | Versions, CHANGELOG et releases automatiques (release-please) | `templates/release.yml` (secret `ORG_AUTOMATION_TOKEN`) |
| `project-sync.yml` | Remplit le Kanban de l'organisation toutes les 15 minutes | — (tourne ici, secret `ORG_AUTOMATION_TOKEN`) |

## Modèles (`templates/`)
À copier dans un repo existant. Pour un **nouveau** repo, partez plutôt du repo modèle [`SanimarcInc/template-projet`](https://github.com/SanimarcInc/template-projet) (*Use this template*), qui contient déjà tout.

- `AGENTS.md` : instructions pour les agents AI (Claude, Codex, Copilot, Cursor…)
- `CLAUDE.md` : importe `AGENTS.md` pour Claude Code

## Étiquettes communes
`bug`, `enhancement`, `documentation`, `securite`, `dette-technique`, `dependencies`, `p1-urgent`, `p2-important`, `p3-normal`, `agent-ai`, `bloque`

> Ce repo est public parce que GitHub l'exige pour les fichiers par défaut. **N'y mettez jamais de code, de secret ni d'information interne.**
