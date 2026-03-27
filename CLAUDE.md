# CLAUDE.md

## Exigences de qualite du code

Le code doit etre :

- Propre et lisible
- Modulaire et maintenable
- Inspire des bonnes pratiques d'un developpeur senior
- Conforme aux principes SOLID, KISS, YAGNI et DRY
- Sans code duplique ni code mort

## Architecture du projet

- Decoupage en plusieurs fichiers avec une responsabilite claire par fichier
- Architecture coherente et consistante
- MVP simple mais suffisamment professionnel pour un portfolio

## Prevention du code mort et duplique

- Ne jamais exporter une fonction, un type ou une variable sans consommateur
- Ne jamais ajouter de prop ou de valeur de retour "au cas ou" : chaque prop/retour doit avoir un usage reel
- Avant de creer une nouvelle logique, verifier si un pattern similaire existe deja et factoriser dans un hook ou composant partage
- Les composants UI reutilisables (drapeaux, formatage, etc.) doivent etre extraits dans `components/ui/`
- Les hooks de donnees (fetch + state) doivent etre extraits dans `hooks/` des qu'ils sont utilises a plus d'un endroit

## Commits

- Conventional Commits : type(scope): description (ex: feat(quiz): add score calculation)
- Messages courts, en anglais
- Regrouper les changements par fonctionnalite (un commit = une unite logique)
- Aucune reference a Claude, IA ou Co-Authored-By dans les commits ou le code
