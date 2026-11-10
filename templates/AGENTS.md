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
   - Étiquette de type : `bug`, `enhancement`, `documentation`, `securite` ou `dette-technique`
   - Étiquette de priorité **seulement si la personne l'a donnée** : `p1-urgent`, `p2-important` ou `p3-normal`. Ne devine jamais la priorité.
   - Ajoute l'étiquette `agent-ai` aux issues que tu crées.
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
- **PR des robots** : ne modifie pas les PR de Dependabot, sauf si on te le demande.

## Fiche du repo : toujours à jour

La fiche du repo (section « About » sur GitHub) et le README décrivent ce que le repo fait **aujourd'hui**. Tu les tiens à jour toi-même.

**Avant d'ouvrir une PR**, vérifie la fiche avec `gh repo view --json description,homepageUrl,repositoryTopics`. Si ta PR change le but du repo, sa stack, ses modules principaux ou son URL, mets à jour :
- **Description** : 1 ou 2 phrases, 350 caractères maximum, en français. Ce que fait le repo, pour qui, et la stack principale entre parenthèses.
  `gh repo edit --description "…"`
- **Site web** : l'URL de l'app déployée, s'il y en a une (`gh repo edit --homepage "…"`). Jamais d'URL inventée.
- **Sujets** : de 3 à 6 sujets, en minuscules avec des tirets. Le domaine (`infor-m3`, `dynamics-365`…), le type (`api`, `etl`, `portail`…) et la stack (`dotnet`, `php`, `react`…).
  `gh repo edit --add-topic <sujet>` et `--remove-topic <sujet>`
- **README** : à quoi sert le repo, la stack, comment le lancer et le tester, sa structure. Mets-le à jour dans la même PR.

Si la fiche est vide ou fausse alors que ta PR ne touche pas ces sujets, corrige-la quand même et mentionne-le dans la PR. Si tu n'as pas les droits pour modifier la fiche, écris la description et les sujets proposés dans la PR.

## Pour terminer
1. Ouvre la PR avec `gh pr create` :
   - Titre : `type(portée): description (#no-issue)`
   - Description : **toutes** les sections du template remplies (Contexte, Changements, Comment tester, Impacts / risques), plus `Closes #<no-issue>`. Coche « Généré ou modifié par un agent AI ».
2. Commente l'issue avec le lien de la PR et ce qui reste à valider par un humain.
3. pr-guard et la CI tournent sur la PR. S'ils échouent, corrige dans la même branche avant de demander une revue.
4. Ne merge pas toi-même, sauf si on te le demande explicitement. L'issue se ferme toute seule au merge grâce à `Closes #`.
5. Si le travail est abandonné : ferme l'issue avec `gh issue close <no> --reason "not planned"` et un commentaire qui explique pourquoi, puis supprime la branche.

## Propre à ce repo
<!-- Stack, commandes de build et de test, branche de base (main ou dev), particularités… -->
