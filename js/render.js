/* EdilTermica — carica i contenuti dai file JSON (modificabili dal pannello /admin)
   e aggiorna la pagina. Se i JSON non sono raggiungibili (es. apertura del file
   in locale senza server), resta il contenuto statico gia' presente nell'HTML. */
(function () {
  'use strict';

  var MAILTO_SUBJECT = 'Richiesta%20informazioni%20%2F%20preventivo';

  function get(obj, path) {
    return path.split('.').reduce(function (o, k) {
      return (o == null) ? undefined : o[k];
    }, obj);
  }

  function applyBindings(D) {
    // testo / HTML
    document.querySelectorAll('[data-bind]').forEach(function (el) {
      var v = get(D, el.getAttribute('data-bind'));
      if (v != null) el.innerHTML = v;
    });
    // immagini
    document.querySelectorAll('[data-bind-src]').forEach(function (el) {
      var v = get(D, el.getAttribute('data-bind-src'));
      if (v != null) el.setAttribute('src', v);
    });
    // link generici (url completo)
    document.querySelectorAll('[data-bind-href]').forEach(function (el) {
      var v = get(D, el.getAttribute('data-bind-href'));
      if (v != null) el.setAttribute('href', v);
    });
    // telefono -> tel:
    document.querySelectorAll('[data-tel]').forEach(function (el) {
      var v = get(D, el.getAttribute('data-tel'));
      if (v != null) el.setAttribute('href', 'tel:' + v);
    });
    // email -> mailto:
    var email = get(D, 'contatti.email');
    if (email) {
      document.querySelectorAll('[data-mailto]').forEach(function (el) {
        el.setAttribute('href', 'mailto:' + email + '?subject=' + MAILTO_SUBJECT);
      });
    }
  }

  function buildStats(stats) {
    if (!Array.isArray(stats)) return;
    var grid = document.getElementById('stats-grid');
    if (!grid) return;
    grid.innerHTML = stats.map(function (s) {
      return '<div class="stat"><strong>' + s.numero + '</strong><span>' + s.label + '</span></div>';
    }).join('');
  }

  function repartoCard(r) {
    var px = (r.posX == null || r.posX === '') ? 50 : r.posX;
    var py = (r.posY == null || r.posY === '') ? 50 : r.posY;
    var z = (r.zoom == null || r.zoom === '') ? 100 : (Number(r.zoom) || 100);
    var scale = z / 100;
    var pos = ' style="object-position:' + px + '% ' + py + '%;--img-zoom:' + scale +
      ';--img-origin:' + px + '% ' + py + '%"';
    return '' +
      '<article class="cat-card">' +
        '<figure><img src="' + r.immagine + '" alt="' + (r.titolo || '') + '" loading="lazy"' + pos + ' /></figure>' +
        '<div class="cat-body">' +
          '<h3>' + r.titolo + '</h3>' +
          '<p>' + r.descrizione + '</p>' +
        '</div>' +
      '</article>';
  }

  var CTA_CARD = '' +
    '<article class="cat-card cat-card--cta">' +
      '<div class="cat-body">' +
        '<h3>E molto altro…</h3>' +
        '<p>Il nostro assortimento cresce di continuo. Non trovi un prodotto? Chiedi: lo reperiamo per te.</p>' +
        '<a href="#contatti" class="btn btn-outline btn-sm">Contattaci</a>' +
      '</div>' +
    '</article>';

  function buildReparti(items) {
    if (!Array.isArray(items)) return;
    var grid = document.getElementById('reparti-grid');
    if (!grid) return;
    grid.innerHTML = items.map(repartoCard).join('') + CTA_CARD;
  }

  function buildGalleria(items) {
    if (!Array.isArray(items)) return;
    var grid = document.getElementById('gallery-grid');
    if (!grid) return;
    grid.innerHTML = items.map(function (it) {
      var f = it.formato || 'orizzontale';
      var cls = (f === 'quadrata') ? 'g-quadrata' : (f === 'verticale' ? 'g-vert' : 'g-orizz');
      var px = (it.posX == null || it.posX === '') ? 50 : it.posX;
      var py = (it.posY == null || it.posY === '') ? 50 : it.posY;
      var z = (it.zoom == null || it.zoom === '') ? 100 : (Number(it.zoom) || 100);
      var style = ' style="object-position:' + px + '% ' + py + '%;--img-zoom:' + (z / 100) +
        ';--img-origin:' + px + '% ' + py + '%"';
      return '<figure class="' + cls + '"><img src="' + it.immagine + '" alt="' +
        (it.alt || '') + '" loading="lazy"' + style + ' /></figure>';
    }).join('');
  }

  function toast(msg) {
    var t = document.getElementById('et-toast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'et-toast';
      t.className = 'et-toast';
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(t._h);
    t._h = setTimeout(function () { t.classList.remove('show'); }, 2800);
  }

  function copyText(txt) {
    return new Promise(function (resolve, reject) {
      function fallback() {
        try {
          var ta = document.createElement('textarea');
          ta.value = txt;
          ta.style.position = 'fixed';
          ta.style.opacity = '0';
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
          resolve();
        } catch (e) { reject(e); }
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(txt).then(resolve, fallback);
      } else { fallback(); }
    });
  }

  function domEmail() {
    var el = document.querySelector('[data-bind="contatti.email"]');
    if (el && el.textContent.indexOf('@') > -1) return el.textContent.trim();
    var a = document.querySelector('a[data-mailto]');
    if (a) {
      var m = (a.getAttribute('href') || '').replace('mailto:', '').split('?')[0];
      if (m.indexOf('@') > -1) return m;
    }
    return '';
  }

  function setupMailto(email) {
    email = email || domEmail();
    if (!email) return;
    document.querySelectorAll('[data-mailto]').forEach(function (el) {
      el.addEventListener('click', function () {
        // copia sempre l'indirizzo: funziona anche senza programma di posta
        copyText(email).then(function () {
          toast('Indirizzo email copiato: ' + email);
        }).catch(function () {});
        // il link mailto continua: apre il client di posta a chi ne ha uno
      });
    });
  }

  function buildManutenzione(D) {
    var m = D.manutenzione;
    if (!m || !m.attiva) return false;
    var c = D.contatti || {};
    var legal = (D.footer && D.footer.legal) || '';
    var righe = '';
    if (c.puntoVenditaIndirizzo) righe += '<li>' + c.puntoVenditaIndirizzo + '</li>';
    if (c.orari) righe += '<li>' + c.orari + '</li>';
    var bottoni = '';
    if (c.telefonoLink) bottoni += '<a class="btn btn-primary btn-lg" href="tel:' + c.telefonoLink + '">Chiama ' + (c.telefono || c.telefonoLink) + '</a>';
    if (c.email) bottoni += '<a class="btn btn-outline btn-lg" href="mailto:' + c.email + '" data-mailto>' + c.email + '</a>';

    var ov = document.createElement('div');
    ov.className = 'maint-overlay';
    ov.innerHTML =
      '<div class="maint-card">' +
        '<img class="maint-logo" src="img/logo.png" alt="EdilTermica Srl" />' +
        '<span class="maint-badge">' + (m.titolo || 'Sito in aggiornamento') + '</span>' +
        '<p class="maint-msg">' + (m.messaggio || '') + '</p>' +
        (bottoni ? '<div class="maint-cta">' + bottoni + '</div>' : '') +
        (righe ? '<ul class="maint-info">' + righe + '</ul>' : '') +
        '<p class="maint-legal">EdilTermica S.r.l.' + (legal ? ' · ' + legal : '') + '</p>' +
      '</div>';
    document.body.appendChild(ov);
    document.body.style.overflow = 'hidden';
    return true;
  }

  function loadJSON(path) {
    return fetch(path, { cache: 'no-cache' }).then(function (r) {
      if (!r.ok) throw new Error(path);
      return r.json();
    });
  }

  Promise.all([
    loadJSON('content/site.json').catch(function () { return null; }),
    loadJSON('content/reparti.json').catch(function () { return null; }),
    loadJSON('content/galleria.json').catch(function () { return null; })
  ]).then(function (res) {
    var site = res[0], reparti = res[1], galleria = res[2];
    if (site && buildManutenzione(site)) {
      // sito in aggiornamento: mostro solo la schermata di manutenzione
      setupMailto(site.contatti ? site.contatti.email : null);
      return;
    }
    if (site) {
      applyBindings(site);
      buildStats(site.stats);
      if (site.reparti && site.reparti.altezzaFoto) {
        document.documentElement.style.setProperty('--cat-img-aspect', site.reparti.altezzaFoto);
      }
    }
    if (reparti && reparti.items) buildReparti(reparti.items);
    if (galleria && galleria.items) buildGalleria(galleria.items);
    setupMailto(site && site.contatti ? site.contatti.email : null);
  });
})();
