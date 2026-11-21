/*
 * Llegeix embarcacions i extres en l'idioma demanat.
 * Si un text no està traduït, es fa servir el català.
 */
import { getCollection, type CollectionEntry } from 'astro:content';
import type { Idioma } from './idiomes';

export type Embarcacio = CollectionEntry<'embarcacions'>['data']['ca'] & { id: string };
export type Extra = CollectionEntry<'extres'>['data']['ca'] & { id: string };

function embarcacioEn(entry: CollectionEntry<'embarcacions'>, l: Idioma): Embarcacio {
  const ca = entry.data.ca;
  const tr = l === 'ca' ? undefined : entry.data[l];
  return {
    ...ca,
    id: entry.id,
    combustible: tr?.combustible ?? ca.combustible,
    equipament: tr?.equipament ?? ca.equipament,
    inclou: tr?.inclou ?? ca.inclou,
    noInclou: tr?.noInclou ?? ca.noInclou,
    // La descripció pot estar dins de "ca:" o, si el fitxer s'ha escrit a mà, a sota de tot.
    body: tr?.body ?? ca.body ?? (entry.body?.trim() || undefined),
  };
}

function extraEn(entry: CollectionEntry<'extres'>, l: Idioma): Extra {
  const ca = entry.data.ca;
  const tr = l === 'ca' ? undefined : entry.data[l];
  return { ...ca, id: entry.id, nom: tr?.nom ?? ca.nom, nota: tr?.nota ?? ca.nota };
}

/** Embarcacions actives, ordenades pel camp "ordre". */
export async function embarcacionsActives(l: Idioma) {
  const totes = await getCollection('embarcacions', (e) => e.data.ca.estat === 'actiu');
  return totes.map((e) => embarcacioEn(e, l)).sort((a, b) => a.ordre - b.ordre);
}

/** Extres actius, ordenats pel camp "ordre". */
export async function extresActius(l: Idioma) {
  const tots = await getCollection('extres', (x) => x.data.ca.estat === 'actiu');
  return tots.map((x) => extraEn(x, l)).sort((a, b) => a.ordre - b.ordre);
}
