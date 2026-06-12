# Sito EdilTermica Srl

Sito vetrina **one-page** statico (HTML/CSS/JS, nessun backend), stile **Moderno**.
Presenta l'azienda come rivendita di materiale edile **al dettaglio e all'ingrosso**,
con la griglia dei **reparti** (ognuno con foto): materiale edile/cemento e premiscelati,
ferramenta, pittura, cartongesso, legnami, elettrico, idraulica, termoidraulica/pellet
e stufe, sanitari, arredo bagno, fotovoltaico, antinfortunistica, irrigazione,
cartelli/segnaletica.

```
sito-web/
  index.html        <- contenuti della pagina
  css/style.css     <- grafica (tema Moderno)
  js/main.js        <- menu mobile, anno footer, validazione form
  img/              <- foto dei reparti (.jpg)
  .nojekyll         <- serve a GitHub Pages per servire i file così come sono
```

> Le foto in `img/` sono temporanee (stock): sostituiscile con foto reali del
> punto vendita mantenendo lo stesso nome file, così l'HTML non va toccato.

## 1. Anteprima in locale

I contenuti vengono caricati da `content/*.json` con `fetch`, che **non funziona
col doppio clic** (`file://`). Usa un server locale:
- estensione **Live Server** di VSCode, oppure
- `python -m http.server 5173` dentro `sito-web/` e apri `http://127.0.0.1:5173/`.

(Senza server resta comunque visibile il contenuto statico di fallback scritto
nell'HTML, ma non quello aggiornato dal pannello.)

## 2. Dove vivono i contenuti

Il sito è **data-driven**: testi, contatti, orari, reparti e galleria stanno in
file dati, NON nell'HTML. Si modificano dal **pannello `/admin`** (vedi sotto) o
a mano:
- `content/site.json` — testi, contatti, orari, footer, numeri in evidenza.
- `content/reparti.json` — elenco reparti (titolo, descrizione, immagine).
- `content/galleria.json` — foto del punto vendita.
- `img/` — tutte le immagini (logo, hero, reparti, galleria).

`js/render.js` legge questi file e compone la pagina. L'HTML contiene anche una
copia statica come fallback/SEO: se modifichi solo i JSON, il sito pubblicato
mostra sempre la versione aggiornata.

Il **modulo contatti** non usa un server: i pulsanti aprono email (`mailto:`) e
telefono (`tel:`) del visitatore. Email/telefono si cambiano dal pannello.

## 3. Pannello di gestione `/admin` (Decap CMS)

Pannello web per modificare tutto il sito senza toccare codice. Login con
GitHub; al salvataggio scrive nei file `content/*.json` / `img/` e il sito si
ripubblica da solo.

Per **attivarlo** servono 3 passaggi una-tantum (poi non si tocca più):

**A) Pubblica il sito su GitHub Pages** (vedi sezione 4): il contenuto di
`sito-web/` deve stare nella radice del repo.

**B) Crea una GitHub OAuth App** (serve per il login):
1. GitHub → Settings → Developer settings → **OAuth Apps** → *New OAuth App*.
2. *Homepage URL*: l'indirizzo del sito (es. `https://TUO-UTENTE.github.io/NOME-REPO/`).
3. *Authorization callback URL*: `https://TUO-AUTH-WORKER.workers.dev/callback`
   (l'URL del worker del punto C).
4. Salva e annota **Client ID**; genera e annota **Client Secret**.

**C) Attiva l'auth worker gratuito** (fa il login al posto del server mancante):
1. Crea un account gratuito su **Cloudflare** → Workers.
2. Deploya il progetto open-source **`sveltia-cms-auth`**
   (github.com/sveltia/sveltia-cms-auth — istruzioni "Deploy to Cloudflare").
3. Nelle variabili del worker imposta `GITHUB_CLIENT_ID` e `GITHUB_CLIENT_SECRET`
   (quelli del punto B).
4. Copia l'URL del worker (es. `https://ediltermica-auth.xxx.workers.dev`).

**D) Configura `admin/config.yml`** — sostituisci i due valori segnati `<<<`:
- `repo: "TUO-UTENTE-GITHUB/NOME-REPO"`
- `base_url: https://TUO-AUTH-WORKER.workers.dev`

Fatto: vai su `https://TUO-SITO/admin/` → **Login with GitHub** → modifichi
testi, foto e reparti da form. Chi modifica deve avere accesso in scrittura al repo.

> Prova senza pubblicare nulla: in una finestra lancia `npx decap-server`, poi
> apri `http://127.0.0.1:5173/admin/` (col sito servito via http). `local_backend`
> è già attivo nel config.

### (Vecchio) modulo form via Formspree — non più usato
Il sito ora usa pulsanti email/telefono al posto del form, quindi non serve
alcun servizio esterno. Se in futuro vuoi un vero form, puoi comunque usare
**Formspree** o **Web3Forms** (gratis, non richiedono la tua password).

## 3. Pubblicare GRATIS su GitHub Pages

Hosting gratuito, aggiornabile con un semplice `git push` da VSCode.

**Opzione A — repository dedicato (consigliato)**
1. Crea su GitHub una nuova repo, es. `ediltermica-sito`.
2. Carica il contenuto della cartella `sito-web/` nella radice della repo
   (così `index.html` sta in cima, non dentro una sottocartella).
3. Su GitHub: **Settings → Pages → Build and deployment**
   - Source: **Deploy from a branch**
   - Branch: **main** / cartella **/(root)** → Save.
4. Dopo ~1 minuto il sito è online su
   `https://TUO-UTENTE.github.io/ediltermica-sito/`.

> Da quel momento, ogni `git commit` + `git push` ripubblica il sito da solo.

## 4. Collegare un dominio personalizzato (es. ediltermica.it)

L'hosting resta gratis: paghi solo il dominio (~10-15 €/anno).

1. Compra il dominio (Aruba, Register.it, Namecheap, ecc.).
2. Nel pannello DNS del dominio crea:
   - 4 record **A** → punta su questi IP di GitHub:
     ```
     185.199.108.153
     185.199.109.153
     185.199.110.153
     185.199.111.153
     ```
   - 1 record **CNAME**: host `www` → valore `TUO-UTENTE.github.io`
3. Crea nella repo un file chiamato **`CNAME`** (senza estensione) con dentro
   solo il dominio, es:
   ```
   ediltermica.it
   ```
4. Su GitHub: **Settings → Pages → Custom domain** → inserisci `ediltermica.it`
   → Save, e spunta **Enforce HTTPS** (può richiedere qualche ora per il
   certificato).

La propagazione DNS può richiedere da pochi minuti ad alcune ore.

## Alternative all'hosting GitHub
- **Netlify** / **Vercel**: trascini la cartella o colleghi la repo, dominio
  personalizzato gratis e HTTPS automatico. Stesso flusso di aggiornamento via Git.
