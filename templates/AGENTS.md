# Instructions pour les agents AI

Ce repo suit le standard SanimarcInc : https://github.com/SanimarcInc/.github/blob/main/CONTRIBUTING.md
Ces règles sont obligatoires. Une PR qui ne les respecte pas est bloquée par le contrôle `pr-guard`.

## Avant de coder
1. Trouve l'issue liée à la demande (`gh issue list`). Si elle n'existe pas, **crée-la** avec `gh issue create` en suivant le bon template (Bug, Fonctionnalité ou Tâche) : contexte, objectif, critères d'acceptation.
2. Crée la branche à partir de la branche de base à jour :
   `<type>/<no-issue>-<description-courte>`. Types : feat, fix, chore, docs, refactor, test, perf, hotfix.
   Minuscules, tirets, sans accents. Ex. `feat/142-filtre-livrables`. **Jamais de nom aléatoire.**
3. Commente l'issue : nom de la branche et plan en quelques points.

## Pendant
- Commits au format Conventional Commits : `type(portée): description (#no-issue)`.
- Ne commite jamais de secret, de `.env` ni de donnée réelle.
- Ne pousse jamais directement sur `main`, `master`, `dev`, `demo` ou `prod`.

## Pour terminer
1. Ouvre la PR avec `gh pr create` :
   - Titre : `type(portée): description (#no-issue)`
   - Description : **toutes** les sections du template remplies (Contexte, Changements, Comment tester, Impacts / risques), plus `Closes #<no-issue>`. Coche « Généré ou modifié par un agent AI ».
2. Commente l'issue avec le lien de la PR.
3. Ne merge pas toi-même, sauf si on te le demande explicitement.

## Propre à ce repo
<!-- Stack, commandes de build et de test, branche de base (main ou dev), particularités… -->
