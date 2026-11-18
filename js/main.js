/* EdilTermica Srl — interazioni del sito */
(function () {
  'use strict';

  // pulisce un'eventuale preferenza tema salvata durante l'anteprima dei 3 stili
  try { localStorage.removeItem('ediltermica-theme'); } catch (e) {}

  /* --- Menu mobile --- */
  var toggle = document.getElementById('navToggle');
  var nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* --- Header con ombra quando si scorre --- */
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* --- Animazioni d'ingresso --- */
  var SELECTOR = '.section-head, .two-col > *, .cat-card, .gallery-grid figure, ' +
                 '.duo-card, .feature, .cta-inner, .stats-grid';
  var io = ('IntersectionObserver' in window) ? new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      var el = en.target;
      io.unobserve(el);
      el.classList.add('is-visible');
      // a fine animazione ripristina le transizioni normali (hover)
      setTimeout(function () {
        el.classList.remove('reveal', 'is-visible');
        el.style.transitionDelay = '';
      }, 1100 + (parseFloat(el.style.transitionDelay) || 0) * 1000);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }) : null;

  function reveal(root) {
    var els = (root || document).querySelectorAll(SELECTOR);
    els.forEach(function (el) {
      if (el.dataset.revealed) return;
      el.dataset.revealed = '1';
      if (!io) return;
      // piccolo sfalsamento tra elementi fratelli (card in griglia)
      var idx = Array.prototype.indexOf.call(el.parentNode.children, el);
      el.style.transitionDelay = ((idx % 4) * 0.08) + 's';
      el.classList.add('reveal');
      io.observe(el);
    });
  }
  window.etReveal = reveal;
  reveal(document);

  /* --- Anno corrente nel footer --- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

})();
