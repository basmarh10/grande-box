# Corrections v3 — brief du 9 juillet (points 2 à 10)

Base de travail : branche `dev` distante (commit 44f4035 — le code réel actuel).
⚠️ `main` sur GitHub date du 4 juillet et ne contient AUCUNE des évolutions
citées dans le brief : penser à merger `dev` dans `main`.

## 2. Shadow acne (damier sur le couvercle) — corrigé
`shadow-bias={-0.0004}` + `shadow-normalBias={0.06}` + shadow map 2048 sur la
lumière directionnelle des 3 scènes (home, fiche produit, outil de rendu).
Aucun damier constaté sur tout le cycle dans mes captures (rendu logiciel) —
**à confirmer sur ton GPU réel**, c'est précisément là que l'acne apparaissait.

## 3. Indices scroll/ballons — dans le premier écran
Déplacés directement sous les boutons CTA (« Scrollez ↓ pour ouvrir la boîte »
+ « Psst… cliquez sur les ballons 🎈 ») : visibles au chargement sur toutes
résolutions, plus jamais ancrés en bas de viewport.

## 4. Ballons de la home — 12, en arc, zone d'exclusion
Composition volontaire : arc au-dessus du titre → boîte, marge gauche, bord
droit, 2 ballons de premier plan qui ENCADRENT la boîte sans la chevaucher.
Zone d'exclusion vérifiée sur tout le cycle (flottement ±0.16, montée
d'ouverture limitée à +0.5, trajectoire du couvercle vers le haut-droite) :
aucun contact ballon/boîte possible. Tous éclatables au clic (PoppableBalloon).

## 5. Contenu intérieur — composant partagé `BoxContents.jsx`
Papier de soie, 3 mini-cadeaux (turquoise/jaune/rose, rubans assortis),
2 boucles de ruban qui dépassent, sparkles. UNE seule implémentation, montée
depuis l'intérieur pilotée par `openRef` — utilisée par la home ET la fiche
produit (les 4 tailles). Plus jamais de panneau plat vide.

## 6. Écran d'intro « grands ballons » — `IntroBalloons.jsx`
16 gros ballons glossy (CSS + GSAP, zéro Framer Motion) qui montent et
remplissent l'écran, titre Grande Box, fondu de sortie. Une fois par
navigateur (`localStorage`, clé `grandebox_intro_seen`). QA : `?intro=1`
force l'intro. Clic = accéléré (fin naturelle, pas de coupure).
`prefers-reduced-motion` : fondu court sans ballons.
Framer Motion retiré de package.json (`npm install` à relancer) ;
`BoxIntro.jsx` et `Balloon.jsx` (SVG) ne sont plus utilisés → supprimables.

## 7. Palette v3 appliquée via les tokens Tailwind
Mêmes noms de tokens (héritage automatique) : `forest` = prune #4A1942
(remplace TOUS les aplats noirs : bandeau CTA, footer, titres), `coral`
#F0483D (action), `gold` #E8B84B, `cream` #FBF5EA + nouveaux tokens
`turquoise`, `sun`, `violet`, `bubblegum` (alias `rose`). Box par taille :
M corail, L turquoise, XL violet, XXL prune — ruban or partout. Renders
catalogue regénérés. Pastilles étapes, BubbleText, confettis, ballons,
options « Couleur dominante » de la fiche : tous recalés sur la palette.

## 8. Fiche produit — interaction complète
Couvercle : soulèvement 1.85 + bascule ~63° + dérive latérale (ample sur la
home via `lidDrift=0.85`, contenue à 0.3 sur la fiche pour rester dans le
cadre). Confettis + contenu intérieur au déclenchement, refermeture au 2e
clic (conservée), identique sur les 4 tailles (testées une par une).

## 9. Superposition / rognage
Cadre produit passé en `aspect-[4/5]` + caméra recadrée : couvercle ouvert,
ballons et confettis restent entièrement dans le cadre (vérifié sur les 4
tailles en captures). Home : canvas plein viewport derrière le contenu avec
`eventSource=body` pour les clics — pas de conteneur `overflow:hidden` sur
son chemin.

## 10. Vérifications faites
- `oxlint` : 0 erreur, 0 warning · `vite build` : OK
- Rejoué en captures : intro (1re visite, fin, 2e visite, ?intro=1), hero,
  éclatement de ballon, ouverture au scroll avec contenu, catalogue,
  ouverture des 4 fiches produit. Captures dans `captures-v3/`.
- Restant à confirmer sur machine réelle (rendu logiciel ici) : absence
  totale d'acne sur GPU, fluidité, teintes exactes.
- Ancien nettoyage possible : `public/images/box-{m,l,xl,xxl}.webp`,
  `hero-box.webp`, `BoxIntro.jsx`, `Balloon.jsx` (plus référencés).
