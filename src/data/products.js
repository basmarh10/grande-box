// Données de démonstration — à remplacer par de vraies données (Supabase) à l'étape 7 du guide.
// Catalogue organisé par TAILLE, volontairement sans catégorie par type d'événement :
// chaque box est présentée comme personnalisable pour n'importe quelle occasion.

export const products = [
  {
    id: "box-m",
    size: "M",
    name: "Grande Box — Taille M",
    tagline: "L'effet surprise, format compact",
    price: 59,
    color: "gold",
    description:
      "Notre plus petit format reste une vraie box géante : 50 cm de côté, pensée pour un premier effet wow sans se ruiner. Personnalisable pour n'importe quelle occasion.",
    features: ["50 x 50 x 50 cm", "Ballons et confettis inclus", "Personnalisation couleurs"],
  },
  {
    id: "box-l",
    size: "L",
    name: "Grande Box — Taille L",
    tagline: "Le format le plus demandé",
    price: 89,
    color: "coral",
    description:
      "Le bon compromis entre impact visuel et praticité. 70 cm de côté, largement de quoi loger ballons, confettis et une surprise centrale.",
    features: ["70 x 70 x 70 cm", "Ballons, confettis et rubans", "Message personnalisé inclus"],
  },
  {
    id: "box-xl",
    size: "XL",
    name: "Grande Box — Taille XL",
    tagline: "Pour marquer les esprits",
    price: 129,
    color: "forest",
    description:
      "1 mètre de côté. La box qui fait se retourner toute la salle. Idéale pour un moment fort, quelle que soit l'occasion que vous célébrez.",
    features: ["100 x 100 x 100 cm", "Contenu 100% sur-mesure", "Installation à domicile incluse"],
  },
  {
    id: "box-xxl",
    size: "XXL",
    name: "Grande Box — Taille XXL",
    tagline: "L'expérience ultime",
    price: 189,
    color: "gold",
    description:
      "Notre format signature : 1,30 m de côté. Conçue avec vous du choix des couleurs jusqu'au contenu final, pour un événement totalement unique.",
    features: ["130 x 130 x 130 cm", "Accompagnement personnalisé", "Livraison et installation incluses"],
  },
];

export const getProductById = (id) => products.find((p) => p.id === id);
