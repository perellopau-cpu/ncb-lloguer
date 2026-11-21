import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/*
 * Forma de les dades de cada embarcació i de cada extra.
 * Els fitxers són a src/content/ i es poden editar des del panell /admin.
 *
 * Cada fitxer té un apartat per idioma:
 *   ca:  totes les dades (el català és l'idioma principal)
 *   es:, en:, fr:  només els textos traduïts. El que no hi sigui es mostra en català.
 *
 * El panell pot deixar camps buits ("" o null). Aquí els tractem com
 * "sense valor", perquè la web no falli mai per un camp buit.
 */
const buit = (v: unknown) => (v === '' || v === null ? undefined : v);
const text = () => z.preprocess(buit, z.string().trim().optional());
const nombre = () => z.preprocess(buit, z.coerce.number().optional());
const netejaLlista = (v: unknown) => {
  if (!Array.isArray(v)) return undefined;
  const net = v.filter((x) => typeof x === 'string' && x.trim() !== '');
  return net.length ? net : undefined;
};
/** Llista de textos; buida si no n'hi ha. */
const llista = () => z.preprocess(netejaLlista, z.array(z.string()).default([]));
/** Llista de textos per a una traducció; sense valor si està buida (així es fa servir el català). */
const llistaTraduida = () => z.preprocess(netejaLlista, z.array(z.string()).optional());
const estat = () => z.preprocess(buit, z.enum(['actiu', 'ocult']).default('actiu'));
const ordre = () => z.preprocess(buit, z.coerce.number().default(100));

const preusDurada = z.preprocess(
  buit,
  z.object({ dia1: nombre(), dies3: nombre(), dies7: nombre() }).optional(),
);

// ---------- Embarcacions ----------
const embarcacioCa = z.object({
  nom: z.string(),
  model: z.string(),
  any: nombre(),
  places: nombre(),
  cabines: nombre(),
  eslora: nombre(), // metres
  manga: nombre(), // metres
  motor: text(),
  combustible: text(),
  diposits: text(),
  equipament: llista(),
  patroObligatori: z.preprocess(buit, z.boolean().default(false)),
  horaRetorn: z.preprocess(
    buit,
    z.coerce.number().pipe(z.union([z.literal(18), z.literal(19)])).optional(),
  ),
  preuDesDe: nombre(),
  preus: z.preprocess(buit, z.object({ mitjana: preusDurada, alta: preusDurada }).optional()),
  fianca: nombre(),
  inclou: llista(),
  noInclou: llista(),
  foto: text(),
  galeria: llista(),
  youtube: text(),
  matterport: text(),
  estat: estat(),
  novetat: nombre(), // any de la novetat, p. ex. 2026
  ordre: ordre(),
  body: text(), // descripció
});

// Camps que es poden traduir
const embarcacioTraduccio = z.preprocess(
  buit,
  z.object({
    combustible: text(),
    equipament: llistaTraduida(),
    inclou: llistaTraduida(),
    noInclou: llistaTraduida(),
    body: text(),
  }).optional(),
);

const embarcacions = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/embarcacions' }),
  schema: z.object({
    ca: embarcacioCa,
    es: embarcacioTraduccio,
    en: embarcacioTraduccio,
    fr: embarcacioTraduccio,
  }),
});

// ---------- Extres ----------
const extraCa = z.object({
  nom: z.string(),
  preu: z.coerce.number(), // € per dia
  preuFins: nombre(), // per a preus amb interval, p. ex. 180–200 €
  nota: text(),
  foto: text(),
  estat: estat(),
  ordre: ordre(),
});

const extraTraduccio = z.preprocess(buit, z.object({ nom: text(), nota: text() }).optional());

const extres = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/extres' }),
  schema: z.object({
    ca: extraCa,
    es: extraTraduccio,
    en: extraTraduccio,
    fr: extraTraduccio,
  }),
});

export const collections = { embarcacions, extres };
