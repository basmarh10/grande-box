# Corrections v5 — ballons, nœuds, intro

## 1. Effet « nuage » : 25 ballons (au lieu de 15)
Ajout d'une couche lointaine en altitude (petits ballons en retrait qui
passent au-dessus du texte sans le gêner) + combleurs de vides aux
mi-hauteurs et dans l'air à droite, derrière la boîte. La zone d'exclusion
autour de la boîte et du couvercle reste respectée ; tous éclatables au clic.

## 2. Nœuds des mini-cadeaux corrigés
- Le nœud est redessiné : deux boucles PLATES posées sur le dessus
  (ellipsoïdes légèrement relevés) + cœur central — lisible sous tous les
  angles, plus jamais d'anneau « poignée » sur le côté.
- L'anneau-poignée du cadeau turquoise et le « nœud manquant » du jaune
  venaient en réalité des deux boucles de ruban DÉCORATIVES posées dans le
  papier de soie (perçues comme détachées / mal rattachées) : elles sont
  SUPPRIMÉES — plus aucun morceau de ruban orphelin.
- Composant partagé : identique home + 4 fiches produit (vérifié).

## 3. Intro « titre + nuage de ballons + transition »
L'intro EXISTE depuis la v3 (`App.jsx` + `IntroBalloons.jsx` +
`IntroBalloons.css`). Si tu ne l'as jamais vue, deux causes possibles :
fichiers du zip v3 non appliqués, ou intro déjà jouée une fois (flag
localStorage). Fiabilisations v5 :
- le flag n'est posé qu'à la FIN de l'animation (une intro interrompue
  rejouera à la visite suivante) ;
- `color-mix()` CSS remplacé par un calcul JS (compatibilité maximale) ;
- nuage densifié : 28 ballons en 3 vagues.
Rappels : une seule fois par navigateur · pour la revoir : `?intro=1` dans
l'URL, ou vider le localStorage · clic = accéléré.
⚠️ Vérifie que ton `src/App.jsx` importe bien `IntroBalloons` (inclus dans
ce zip) et relance `npm install` (framer-motion retiré en v3).

## Vérifications
oxlint 0 erreur · build OK · captures dans `captures-v5/` : intro (nuage,
fin, 2e visite sans intro), hero 1440 avec nuage, ouverture avec nœuds,
fiche M ouverte (nœuds visibles sur les 3 mini-cadeaux).
