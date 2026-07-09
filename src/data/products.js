// Données de démonstration — à remplacer par de vraies données (Supabase) à l'étape 7 du guide.
// Catalogue organisé par TAILLE, volontairement sans catégorie par type d'événement.
//
// Couleurs des box : palette v3 — une dominante par taille pour lire la
// gamme d'un coup d'œil, ruban OR (#E8B84B) sur toutes :
// M corail, L turquoise, XL violet, XXL prune.
// `sizeRatio` = côté réel / côté du XXL (130 cm) : pilote la taille du visuel
// dans les cartes du catalogue pour que M < L < XL < XXL se voie d'un coup d'œil.

export const products = [
  {
    id: "box-m",
    image: "/images/box-m-3d.webp",
    size: "M",
    sizeCm: 50,
    sizeRatio: 50 / 130,
    boxColor: "#F0483D",     // corail
    ribbonColor: "#E8B84B",  // ruban or
    accent: "coral",
    name: "Grande Box — Taille M",
    tagline: "L'effet surprise, format compact",
    price: 59,
    description:
      "Notre plus petit format reste une vraie box géante : 50 cm de côté, pensée pour un premier effet wow sans se ruiner. Personnalisable pour n'importe quelle occasion.",
    features: ["50 x 50 x 50 cm", "Ballons et confettis inclus", "Personnalisation couleurs"],
  },
  {
    id: "box-l",
    image: "/images/box-l-3d.webp",
    size: "L",
    sizeCm: 70,
    sizeRatio: 70 / 130,
    boxColor: "#2EC4B6",     // turquoise
    ribbonColor: "#E8B84B",  // ruban or
    accent: "turquoise",
    name: "Grande Box — Taille L",
    tagline: "Le format le plus demandé",
    price: 89,
    description:
      "Le bon compromis entre impact visuel et praticité. 70 cm de côté, largement de quoi loger ballons, confettis et une surprise centrale.",
    features: ["70 x 70 x 70 cm", "Ballons, confettis et rubans", "Message personnalisé inclus"],
  },
  {
    id: "box-xl",
    image: "/images/box-xl-3d.webp",
    size: "XL",
    sizeCm: 100,
    sizeRatio: 100 / 130,
    boxColor: "#8E5FD1",     // violet
    ribbonColor: "#E8B84B",  // ruban or
    accent: "violet",
    name: "Grande Box — Taille XL",
    tagline: "Pour marquer les esprits",
    price: 129,
    description:
      "1 mètre de côté. La box qui fait se retourner toute la salle. Idéale pour un moment fort, quelle que soit l'occasion que vous célébrez.",
    features: ["100 x 100 x 100 cm", "Contenu 100% sur-mesure", "Installation à domicile incluse"],
  },
  {
    id: "box-xxl",
    image: "/images/box-xxl-3d.webp",
    size: "XXL",
    sizeCm: 130,
    sizeRatio: 1,
    boxColor: "#4A1942",     // prune
    ribbonColor: "#E8B84B",  // ruban or
    accent: "forest",
    name: "Grande Box — Taille XXL",
    tagline: "L'expérience ultime",
    price: 189,
    description:
      "Notre format signature : 1,30 m de côté. Conçue avec vous du choix des couleurs jusqu'au contenu final, pour un événement totalement unique.",
    features: ["130 x 130 x 130 cm", "Accompagnement personnalisé", "Livraison et installation incluses"],
  },
];

export const getProductById = (id) => products.find((p) => p.id === id);
