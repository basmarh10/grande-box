# Corrections — retours du 9 juillet

## 1. Résidus de découpe sur les images
Les photos détourées sont remplacées par des **rendus générés directement depuis le
modèle 3D du site** (fond transparent net, zéro résidu) : `public/images/box-*-3d.webp`.
Pour les regénérer : ouvrir `/box-render.html?box=D6252E&ribbon=D9A441` en dev et
capturer avec fond omis (voir `src/render-box-entry.jsx`).
Les anciens fichiers `box-m/l/xl/xxl.webp` et `hero-box.webp` ne sont plus référencés
et peuvent être supprimés.

## 2. Différenciation des tailles au catalogue
`sizeRatio` (côté réel / 130 cm) dans `products.js` pilote la largeur du visuel :
M 35 %, L 50 %, XL 71 %, XXL 92 % du cadre. Toutes les box sont posées sur la même
ligne de sol (cadre en `items-end`) pour une lecture immédiate des tailles.

## 3. Palette des box
Fini le vert sauge/vert foncé. Les 4 box utilisent strictement la palette :
M = crème + ruban corail · L = corail + doré · XL = doré + noir · XXL = noir + doré.

## 4. Animation hover du catalogue
Tilt qui répond en 90 ms (au lieu de 350 ms → plus de lag), lift en 180 ms avec
rebond franc (`cubic-bezier(0.34, 1.56, 0.64, 1)`), flottement d'ambiance 3,4 s / 9 px
au lieu de 5,5 s / 7 px (désormais perceptible), sans saccade.

## 5. Fiche produit : scène 3D interactive
`src/three/ProductScene3D.jsx` : vraie scène R3F aux couleurs de la box affichée.
Clic → le couvercle s'ouvre, 5 ballons s'élèvent de la boîte, burst de confettis.
Nouveau clic → tout se referme. Style Spline recréé en code (RoundedBox + clearcoat,
nœud en boucles pleines) — aucun fichier Spline importé, aucun asset externe.

## 6. Accueil : cadeau + ballons
- Boîte refondue : arêtes arrondies, laque glossy, ruban satiné (GiftBox3D réécrit).
- Ballons ~2× plus petits, flottement permanent (portance + houle + balancement).
- **Éclatables au clic** (`PoppableBalloon.jsx`) : éclat de particules puis le ballon
  regonfle après 2,5 s. Rendu possible par `eventSource={document.body}` sur le
  Canvas (les clics traversent la page jusqu'à la scène) + `pointer-events-none`
  sur le contenu du hero avec réactivation sur les boutons.
- Confettis au moment où la boîte s'ouvre au scroll.
- Éclairage 100 % local (plus de HDRI réseau) : rendu stable, chargement plus sûr.

## 7. Couleur globale
- CTA primaires en corail (couleur d'action de la palette) : hero, header, fiche produit.
- Cadres des cartes catalogue teintés par box (rose / corail / doré / noir).
- « Comment ça marche » : fond dégradé rose→doré, numéros en pastilles colorées.
- Halos corail/doré derrière la gamme et dans le bloc CTA noir.
- Filet dégradé corail→doré→rose au-dessus du footer.
- Section « L'effet Grande Box » : carte ivoire à liseré corail.
