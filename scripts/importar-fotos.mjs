// Ús puntual: baixa les fotos de la web oficial (en el mateix ordre) i les deixa
// optimitzades (WebP, màx. 2000 px) a public/images/. Escriu un resum JSON.
// node scripts/importar-fotos.mjs <carpeta-html> <sortida.json>
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const [dirHtml, sortida] = process.argv.slice(2);
const arrel = path.resolve(import.meta.dirname, '..');

const feines = [
  { tipus: 'embarcacions', id: 'creta', html: 'b-salpa-soleil-28.html' },
  { tipus: 'embarcacions', id: 'buonavita', html: 'b-jeanneau-cap-camarat-9-0-cc1.html' },
  { tipus: 'embarcacions', id: 'artemisa', html: 'b-jeanneau-capcamarat-9-0-wa-serie-2-novedad-2026.html' },
  { tipus: 'embarcacions', id: 'flash', html: 'b-jeanneau-cap-camarat-12-5wa-novedad-2026.html' },
  { tipus: 'embarcacions', id: 'new-age', html: 'b-gozzo-positano-32-open-novedad-2026.html' },
  { tipus: 'extres', id: 'wakeboard', html: 'ex-wakeboard.html' },
  { tipus: 'extres', id: 'donut', html: 'ex-donut.html' },
  { tipus: 'extres', id: 'esqui-aquatic', html: 'ex-esquis.html' },
  { tipus: 'extres', id: 'padel-surf', html: 'ex-padel-surf.html' },
];

const resum = {};
for (const f of feines) {
  const html = await fs.readFile(path.join(dirHtml, f.html), 'utf8');
  const noms = [...html.matchAll(/data-src="https:\/\/images\.hoobaweb\.com\/896\/pimg-1600-1600\/([^"]+)"/g)]
    .map((m) => m[1])
    .filter((n, i, a) => a.indexOf(n) === i);
  const carpeta = path.join(arrel, 'public/images', f.tipus);
  await fs.mkdir(carpeta, { recursive: true });
  resum[f.id] = [];
  for (const [i, nom] of noms.entries()) {
    const url = `https://images.hoobaweb.com/896/pimg-2400-2400/${nom}`;
    const r = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (!r.ok || !String(r.headers.get('content-type')).startsWith('image/')) {
      throw new Error(`${url} → ${r.status} ${r.headers.get('content-type')}`);
    }
    const buf = Buffer.from(await r.arrayBuffer());
    const fitxer = `${f.id}-${String(i + 1).padStart(2, '0')}.webp`;
    const info = await sharp(buf)
      .rotate()
      .resize({ width: 2000, height: 2000, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(path.join(carpeta, fitxer));
    resum[f.id].push({ fitxer: `/images/${f.tipus}/${fitxer}`, origen: nom, mida: `${info.width}x${info.height}`, kb: Math.round(info.size / 1024) });
  }
  console.log(f.id, resum[f.id].length);
}
await fs.writeFile(sortida, JSON.stringify(resum, null, 2));
