# Instructions pour les agents AI

Ce repo suit le standard SanimarcInc : https://github.com/SanimarcInc/.github/blob/main/CONTRIBUTING.md
Ces règles sont obligatoires. Une PR qui ne les respecte pas est bloquée par le contrôle `pr-guard`.

## Règle de base : une issue pour chaque chose

**Tout travail passe par une issue GitHub, sans exception** : fonctionnalité, bug, correctif, refactor, doc, mise à jour de dépendances, analyse. Tu crées et tu gères les issues toi-même, du début à la fin. Personne ne devrait avoir à le faire à ta place.

## Avant de coder
1. Cherche si une issue existe déjà : `gh issue list --search "<mots-clés>" --state all`.
2. Si elle n'existe pas, **crée-la** avec `gh issue create`, en suivant la structure du bon template :
   - **Bug** : problème, étapes pour reproduire, comportement attendu, environnement
   - **Fonctionnalité** : besoin, solution proposée, critères d'acceptation (cases à cocher)
   - **Tâche** : à faire, pourquoi, c'est fini quand (cases à cocher)
   - Étiquette : `bug`, `enhancement` ou `documentation`
3. **Assigne-toi l'issue** au nom de la personne qui t'utilise : `gh issue edit <no> --add-assignee @me`.
4. Si la demande couvre plusieurs sujets, **crée une issue par sujet**. Une issue = une branche = une PR.
5. Crée la branche à partir de la branche de base à jour :
   `<type>/<no-issue>-<description-courte>`. Types : feat, fix, chore, docs, refactor, test, perf, hotfix.
   Minuscules, tirets, sans accents. Ex. `feat/142-filtre-livrables`. **Jamais de nom aléatoire.**
6. Commente l'issue : « Branche `<nom>` créée. Plan : … » en quelques points.

## Pendant
- Commits au format Conventional Commits : `type(portée): description (#no-issue)`.
- **Tiens l'issue à jour** : coche les critères d'acceptation au fur et à mesure (`gh issue edit <no> --body …`), et commente quand tu changes de plan, quand tu bloques ou quand tu prends une décision importante.
- **Tu découvres un autre problème** (bug, dette technique, faille) qui sort du sujet ? Ne le corrige pas dans la même PR : **crée une nouvelle issue** et mentionne-la dans l'issue en cours (« Découvert : #<no> »).
- Ne commite jamais de secret, de `.env` ni de donnée réelle.
- Ne pousse jamais directement sur `main`, `master`, `dev`, `demo` ou `prod`.

## Pour terminer
1. Ouvre la PR avec `gh pr create` :
   - Titre : `type(portée): description (#no-issue)`
   - Description : **toutes** les sections du template remplies (Contexte, Changements, Comment tester, Impacts / risques), plus `Closes #<no-issue>`. Coche « Généré ou modifié par un agent AI ».
2. Commente l'issue avec le lien de la PR et ce qui reste à valider par un humain.
3. Ne merge pas toi-même, sauf si on te le demande explicitement. L'issue se ferme toute seule au merge grâce à `Closes #`.
4. Si le travail est abandonné : ferme l'issue avec `gh issue close <no> --reason "not planned"` et un commentaire qui explique pourquoi, puis supprime la branche.

## Propre à ce repo
<!-- Stack, commandes de build et de test, branche de base (main ou dev), particularités… -->
