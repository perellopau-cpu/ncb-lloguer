# Com publicar la web (pas a pas)

Aquesta guia és per a la persona que posa la web en marxa. Només s'ha de fer una vegada i es tarda uns 30–45 minuts. **Tot és gratuït** i no cal posar cap targeta.

## Què farem, en una frase

- **GitHub** és l'arxiu on es guarda la web i on el panell `/admin` desa cada canvi.
- **Cloudflare** és qui ensenya la web a internet. Cada vegada que l'arxiu canvia, torna a publicar la web sola en 1–2 minuts.
- Un **petit servei d'inici de sessió**, també a Cloudflare, permet que el comercial entri al panell amb el seu usuari de GitHub.

> **Consell:** crea els comptes amb un correu **de l'empresa** (per exemple, el general), no amb un de personal. Així l'empresa no en perd mai el control.
>
> **Seguretat:** les contrasenyes i les «claus secretes» no les enviïs mai per xat ni per correu, tampoc a mi. Només s'han d'enganxar a les pantalles que indica aquesta guia.

---

## Part A — GitHub (l'arxiu)

1. Ves a **github.com** → **Sign up**. Posa-hi el correu de l'empresa, una contrasenya i un nom d'usuari (per exemple `nauticacostabrava`). Confirma el codi que t'arriba per correu.
2. Ja dins, a dalt a la dreta: **+** → **New repository**.
   - *Repository name:* `ncb-lloguer`
   - Marca **Private** (així ningú no veu l'arxiu; la web serà pública igualment).
   - **No** marquis «Add a README» ni cap altra opció.
   - **Create repository**.
3. **Digue'm el nom d'usuari** que has triat. Jo hi pujaré la web: s'obrirà una finestra del navegador perquè hi entris amb el teu compte de GitHub, i res més.

## Part B — Cloudflare (publicar la web)

4. Ves a **dash.cloudflare.com/sign-up** i crea el compte amb el mateix correu. Confirma'l des del correu.
5. Al menú de l'esquerra: **Workers & Pages** → **Create application** → pestanya **Pages** → **Import an existing Git repository**.
6. **Connect GitHub**. GitHub et preguntarà a quins repositoris pot accedir Cloudflare: tria **Only select repositories** → `ncb-lloguer` → **Install & Authorize**.
7. Selecciona `ncb-lloguer` → **Begin setup** i omple:
   - *Project name:* `ncb-lloguer` (aquest nom decideix l'adreça: `ncb-lloguer.pages.dev`)
   - *Production branch:* `main`
   - *Framework preset:* **Astro**
   - *Build command:* `npm run build`
   - *Build output directory:* `dist`
   - **Save and Deploy**. Espera 1–2 minuts.
8. Obre **https://ncb-lloguer.pages.dev**: la web ja és a internet. 🎉
   Si Cloudflare t'ha donat una adreça una mica diferent perquè el nom ja estava agafat, **digue-me-la** i la canviaré.

## Part C — L'inici de sessió del panell

9. Obre aquest enllaç i prem **Deploy**. Crea el servei gratuït d'inici de sessió (*Sveltia CMS Authenticator*):
   **https://deploy.workers.cloudflare.com/?url=https://github.com/sveltia/sveltia-cms-auth**
   Si et demana connectar GitHub o crear-hi una còpia, accepta-ho: és normal.
10. Quan acabi, ves a **Workers & Pages** → **sveltia-cms-auth** i copia l'adreça que surt. És semblant a `https://sveltia-cms-auth.NOM.workers.dev`. **Envia-me-la** (no és secreta).
11. Ara crearem el «permís» de GitHub perquè el panell pugui desar canvis. Obre aquest enllaç amb la sessió de GitHub iniciada:
    **https://github.com/settings/apps/new?name=NCB+Lloguer+Panell&url=https://ncb-lloguer.pages.dev&webhook_active=false&contents=write&pull_requests=write**
    - *Callback URL:* l'adreça del pas 10 amb `/callback` al final.
      Exemple: `https://sveltia-cms-auth.NOM.workers.dev/callback`
    - Deixa **desmarcats** *Webhook → Active* i *Enable Device Flow*.
    - *Where can this GitHub App be installed?* → **Only on this account**.
    - **Create GitHub App**.
12. A la pàgina que s'obre:
    - Copia el **Client ID** (el necessitaràs al pas 14).
    - Prem **Generate a new client secret** i copia el codi llarg. **Només es veu una vegada**, així que deixa la pestanya oberta fins al pas 14.
13. Al menú de l'esquerra d'aquella mateixa pàgina: **Install App** → **Install** → **Only select repositories** → `ncb-lloguer` → **Install**.
14. Torna a Cloudflare: **Workers & Pages** → **sveltia-cms-auth** → **Settings** → **Variables and Secrets** → **Add**, i afegeix aquestes tres:

    | Nom (exactament així) | Valor | Tipus |
    |---|---|---|
    | `GITHUB_CLIENT_ID` | el Client ID del pas 12 | Text |
    | `GITHUB_CLIENT_SECRET` | el codi secret del pas 12 | **Secret** |
    | `ALLOWED_DOMAINS` | `ncb-lloguer.pages.dev` | Text |

    → **Deploy** (o **Save and deploy**).
15. **Avisa'm.** Jo connectaré el panell amb el teu compte i el servei, i el provarem plegats a **https://ncb-lloguer.pages.dev/admin** → **Sign in with GitHub**.

## Part D — Donar accés al comercial

16. El comercial es crea **el seu propi compte** a **github.com** (gratuït, amb el seu correu de feina). Que et digui el seu nom d'usuari.
17. Tu, des del compte de l'empresa: obre el repositori `ncb-lloguer` → **Settings** → **Collaborators** → **Add people** → escriu el seu usuari → **Add**.
18. Al comercial li arriba un correu d'invitació: ha de prémer **Accept invitation**.
19. Des d'aquell moment pot entrar a **https://ncb-lloguer.pages.dev/admin** → **Sign in with GitHub**. La guia del comercial és a `2-GUIA-DEL-COMERCIAL.md`.

**Per treure-li l'accés** (per exemple, si deixa l'empresa): mateix lloc, **Settings → Collaborators** → **Remove**.

---

## Més endavant: el domini propi

Quan l'empresa aprovi la web, a Cloudflare → projecte `ncb-lloguer` → **Custom domains** s'hi pot afegir l'adreça definitiva (per exemple `lloguer.nauticacostabrava.com`). Aleshores caldrà actualitzar l'adreça en tres llocs: la configuració de la web, la del panell i `ALLOWED_DOMAINS`.

## Quant costa

- GitHub: 0 €.
- Cloudflare Pages: 0 €. Permet 500 publicacions al mes i no limita les visites.
- Servei d'inici de sessió: 0 €. El pla gratuït de Cloudflare Workers permet 100.000 usos al dia, i n'hi ha prou amb un per cada vegada que algú entra al panell.
- Només es pagaria el **domini propi**, quan es vulgui: uns 10–15 € l'any, i potser l'empresa ja el té.
