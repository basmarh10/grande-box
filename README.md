# Grande Box — starter

Squelette de départ pour le site (React + Vite + Tailwind + Framer Motion),
construit à partir de l'analyse du site de référence et du cahier des charges
dans Notion. Le nom "Grande Box" est un placeholder — remplace-le partout où
tu le vois une fois le nom de marque choisi.

## Ce qui est déjà fait

- Page d'accueil, catalogue, fiche produit, panier, contact (routing complet)
- L'animation d'ouverture signature : clic sur la boîte → ballons → entrée sur le site
  (`src/components/BoxIntro.jsx`)
- Catalogue organisé par **taille** (M/L/XL/XXL), pas par type d'événement
- Panier fonctionnel (ajout, quantités, total) — en mémoire pour l'instant
- Palette de couleurs et typographie appliquées (voir `tailwind.config.js`)
- Formulaire de contact (UI uniquement, pas encore d'envoi réel)

## Ce qui reste à faire

Ce starter couvre le **front-end**. Pour un site prêt à l'emploi, il reste :

1. **Vraies photos produits** — les box sont illustrées en SVG pour l'instant
2. **Base de données (Supabase)** — remplacer `src/data/products.js` par de vraies données
3. **Paiement (Stripe)** — le bouton "Passer commande" ne débite rien pour l'instant
4. **Statistiques d'achats** — un tableau de bord admin, une fois Supabase branché
5. **Déploiement** — Netlify ou Vercel, connecté à ce repo GitHub

Le détail de ces étapes est dans la page Notion **"💻 Guide de développement
pas à pas"** du projet.

## Lancer le projet en local

```bash
npm install
npm run dev
```

Le site s'ouvre sur http://localhost:5173

## Mettre ce code dans ton repo GitHub

Depuis ce dossier, une fois dézippé :

```bash
cd grande-box
git init
git remote add origin https://github.com/basmarh10/Project-suprise.git
git add .
git commit -m "Premier import du starter"
git branch -M main
git push -u origin main
```

Si le repo GitHub contient déjà des fichiers (ex. un README créé sur GitHub),
fais d'abord `git pull origin main --allow-unrelated-histories` avant le push.

test