# Corrections v4 — retours "ajustements" (4 points)

## 1. Ouverture ralentie
- La plage de scroll de l'ouverture passe de 14 % à 31 % de la page
  (0.03→0.34) : la révélation prend ~3× plus de temps de scroll.
- Confettis : gravité divisée par 2, durée de vie 2.6 s → 4.8 s, vitesses
  initiales réduites, papillonnement latéral pendant la descente.
- Mini-cadeaux : sortie ÉTAGÉE (un à un, fenêtres lentes avec easing),
  plus de « pop » instantané.
- Le glissement de la scène vers la gauche ne démarre plus qu'à 30 % de
  scroll, une fois la révélation quasi terminée.

## 2. Ballons : 15, toutes les zones habitées
Coin haut-droit (près du Panier), arc complet au-dessus du titre, toute la
marge gauche (4 hauteurs, du haut jusqu'en bas), bande basse sous les
boutons et sous la boîte (premier plan). Zone d'exclusion recalculée sur
tout le cycle (flottement, montée, trajectoire du couvercle — dérive
réduite à 0.6) : aucun contact possible avec la boîte. Tous éclatables.

## 3. Nœuds sur les mini-cadeaux « lucioles »
Chaque mini-cadeau a maintenant ruban croisé + nœud (deux boucles + cœur),
comme la grande boîte. En prime : effet luciole renforcé — ils sortent
lentement, montent au-dessus de la boîte puis FLOTTENT sur place en
tournant doucement. Comme le composant `BoxContents` est partagé, c'est
identique sur la home ET les 4 fiches produit (vérifié en capture).

## 4. Boîte principale entièrement visible
Caméra reculée (z 6.2), boîte recalée (x 2.38, échelle 0.9) : entièrement
visible à 1280×800 ET 1440×900, marges des deux côtés, sans jamais
chevaucher le titre. Le couvercle reste aussi dans l'écran pendant tout
son vol (vérifié à mi-ouverture).

## Vérifications
- oxlint 0 erreur / vite build OK.
- Captures 1280 + 1440 : hero, mi-ouverture, fin d'ouverture, fiche XL
  ouverte (nœuds visibles) — dossier `captures-v4/`.
- Fichiers modifiés : ScrollScene.jsx, Confetti.jsx, BoxContents.jsx.
