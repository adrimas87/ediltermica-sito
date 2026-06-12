# EdilTermica — sito web (riassunto)

Sito vetrina statico, gratuito, gestibile da un pannello. Tutto in sintesi.

## Indirizzi
- **Sito:** https://www.ediltermica.srl (anche `ediltermica.srl` → reindirizza a www)
- **Pannello:** https://www.ediltermica.srl/admin/
- **Repository GitHub:** `adrimas87/ediltermica-sito`
- **Hosting:** GitHub Pages (gratis) · **DNS/dominio:** Aruba · **Login pannello:** Cloudflare Worker

## Struttura cartella
- `index.html` – pagina · `css/` – grafica · `js/` – `render.js` carica i contenuti
- `content/` – **i contenuti**: `site.json` (testi/contatti/orari), `reparti.json`, `galleria.json`
- `img/` – tutte le immagini (logo, hero, reparti, galleria)
- `admin/` – pannello (Decap CMS) · `CNAME` – il dominio

## Come aggiornare i contenuti
1. **Dal pannello** (consigliato): vai su `/admin/` → **Login with GitHub** → modifica testi/foto/reparti → **Publish**. Il sito si aggiorna da solo in ~1 minuto.
2. **A mano**: modifica `content/*.json` o sostituisci una foto in `img/` (stesso nome), poi pubblica con Git (sotto).

## Modalità "Sito in aggiornamento"
Pannello → *Contenuti del sito* → **⚙️ Sito in aggiornamento** → interruttore ON/OFF.
ON = i visitatori vedono solo logo, recapiti e messaggio. (A mano: `content/site.json` → `"attiva": true/false`.)

## Pubblicare modifiche via Git
Dalla cartella del sito:
```
git add -A
git commit -m "descrizione modifica"
git push
```

## Com'è stato pubblicato (per memoria)
1. **GitHub Pages**: repo `adrimas87/ediltermica-sito`, Pages attivo su branch `main`, cartella root.
2. **Dominio (Aruba → DNS)**, senza toccare l'email (MX):
   - 4 record **A** su `@` → `185.199.108.153`, `.109.153`, `.110.153`, `.111.153`
   - 1 record **CNAME** `www` → `adrimas87.github.io`
   - file `CNAME` nel repo = `www.ediltermica.srl`
3. **HTTPS**: certificato automatico (Let's Encrypt) + "Forza HTTPS" attivo.

## Login del pannello (componenti)
- **GitHub OAuth App** "EdilTermica Pannello" — callback: `<worker>/callback`
- **Cloudflare Worker** `sveltia-cms-auth`: `https://sveltia-cms-auth.mastronunzioadriano.workers.dev`
  - Variabili: `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `ALLOWED_DOMAINS=adrimas87.github.io,www.ediltermica.srl,ediltermica.srl`
- **`admin/config.yml`**: `repo` + `base_url` (URL del worker)

## Da custodire (accessi)
- Account **GitHub** (adrimas87) · Account **Cloudflare** · **Client ID/Secret** della OAuth App (salvati nelle variabili del Worker).

> Dettagli tecnici estesi: vedi `README.md`.
