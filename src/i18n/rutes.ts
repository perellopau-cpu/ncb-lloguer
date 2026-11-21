import { embarcacionsActives } from './contingut';
import { infoIdiomes, type Idioma } from './idiomes';

/** Totes les fitxes d'un idioma, amb 3 embarcacions més per suggerir al final de cada una. */
export async function pathsFitxes(l: Idioma) {
  const actives = await embarcacionsActives(l);
  return actives.map((e, i) => {
    const altres = [1, 2, 3]
      .map((n) => actives[(i + n) % actives.length])
      .filter((x) => x.id !== e.id);
    const params = l === 'ca'
      ? { id: e.id }
      : { lang: l, seccio: infoIdiomes[l].seccio, id: e.id };
    return { params, props: { l, e, altres } };
  });
}
