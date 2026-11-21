// Dades de contacte i enllaços. Canviant-les aquí, canvien a tota la web.
// (Els textos de cada idioma són a src/i18n/textos.ts)
export const contacte = {
  telefon: '972 31 71 89',
  telefonLink: 'tel:+34972317189',
  whatsapp: '609 782 745',
  whatsappNumero: '34609782745',
  correu: 'reservas@nauticacostabrava.com',
  adreca: 'Carrer Àngel Guimerà, 59 · 17230 Palamós',
  instagram: 'https://www.instagram.com/nauticacostabrava/',
};

export const webOficial = 'https://www.nauticacostabrava.com';

// Condicions generals (números). Una embarcació pot tenir una fiança pròpia.
export const condicions = {
  fianca: 1500,
  fiancaAmbPatro: 500,
  patroDesDe: 180,
};

/** Enllaç a WhatsApp, amb un missatge ja escrit si se n'hi passa un. */
export function enllacWhatsapp(missatge?: string) {
  const base = `https://wa.me/${contacte.whatsappNumero}`;
  return missatge ? `${base}?text=${encodeURIComponent(missatge)}` : base;
}

/** Treu l'identificador d'un enllaç de YouTube (watch?v=, youtu.be/, shorts/, embed/). */
export function idYoutube(url: string) {
  const m = url.match(/(?:v=|youtu\.be\/|shorts\/|embed\/)([\w-]{11})/);
  return m ? m[1] : undefined;
}
