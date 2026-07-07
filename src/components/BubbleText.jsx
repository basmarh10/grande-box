/*
 * Texte « bulle glossy » — effet gonflé et brillant façon bubble letters.
 * Recréé en CSS pur (dégradés + ombres en couches + reflet en pseudo-élément)
 * pour fonctionner avec n'importe quel texte dynamique : la référence vidéo
 * utilisait des PNG statiques, impossible ici puisque le client tape son
 * propre prénom.
 *
 * Le reflet utilise `data-text` + ::before : le même texte est superposé
 * avec un dégradé blanc masqué, ce qui crée le point de lumière du haut.
 */
import "./BubbleText.css";

export default function BubbleText({ text, tone = "rouge", className = "" }) {
  const content = (text || "").trim() || "Cadeau";
  return (
    <span
      className={`bubble-text bubble-text--${tone} ${className}`}
      data-text={content}
      aria-label={content}
    >
      {content}
    </span>
  );
}
