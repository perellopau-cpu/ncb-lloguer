/*
 * Idiomes de la web i adreces de cada pàgina.
 *   Català (principal):  /              /embarcacions/creta/
 *   Castellà:            /es/           /es/barcos/creta/
 *   Anglès:              /en/           /en/boats/creta/
 *   Francès:             /fr/           /fr/bateaux/creta/
 */
export const idiomes = ['ca', 'es', 'en', 'fr'] as const;
export type Idioma = (typeof idiomes)[number];
export const idiomaPrincipal: Idioma = 'ca';
export const altresIdiomes = idiomes.filter((l) => l !== idiomaPrincipal) as Exclude<Idioma, 'ca'>[];

export const infoIdiomes: Record<Idioma, { nom: string; locale: string; og: string; seccio: string }> = {
  ca: { nom: 'Català', locale: 'ca-ES', og: 'ca_ES', seccio: 'embarcacions' },
  es: { nom: 'Español', locale: 'es-ES', og: 'es_ES', seccio: 'barcos' },
  en: { nom: 'English', locale: 'en-GB', og: 'en_GB', seccio: 'boats' },
  fr: { nom: 'Français', locale: 'fr-FR', og: 'fr_FR', seccio: 'bateaux' },
};

const prefix = (l: Idioma) => (l === idiomaPrincipal ? '' : `/${l}`);

export const rutaInici = (l: Idioma) => `${prefix(l)}/`;
export const rutaFitxa = (l: Idioma, id: string) => `${prefix(l)}/${infoIdiomes[l].seccio}/${id}/`;

/** Adreça de la mateixa pàgina en cada idioma (per al selector i per a Google). */
export type Alternatives = Record<Idioma, string>;
export const alternativesInici = (): Alternatives =>
  Object.fromEntries(idiomes.map((l) => [l, rutaInici(l)])) as Alternatives;
export const alternativesFitxa = (id: string): Alternatives =>
  Object.fromEntries(idiomes.map((l) => [l, rutaFitxa(l, id)])) as Alternatives;

/** 699 -> "699 €" (ca/es/fr) o "€699" (en), amb separador de milers sempre. */
export function euros(n: number, l: Idioma) {
  return new Intl.NumberFormat(infoIdiomes[l].locale, {
    style: 'currency', currency: 'EUR', maximumFractionDigits: 0, useGrouping: 'always' as const,
  }).format(n);
}

/** 8.9 -> "8,9" (ca/es/fr) o "8.9" (en) */
export function numero(n: number, l: Idioma, decimals = 2) {
  return new Intl.NumberFormat(infoIdiomes[l].locale, { maximumFractionDigits: decimals }).format(n);
}
