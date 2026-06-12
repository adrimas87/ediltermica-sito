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

  /* --- Anno corrente nel footer --- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

})();
