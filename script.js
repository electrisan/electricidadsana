/* Electricidad Sana – JavaScript puro, sin dependencias */
(function () {
  'use strict';

  // Año actual en el pie
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // ---------- Menú móvil ----------
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
      toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ---------- Diálogos (legales y visor) ----------
  function openDialog(d) {
    if (!d) return;
    if (typeof d.showModal === 'function') d.showModal();
    else d.setAttribute('open', '');
  }
  function closeDialog(d) {
    if (typeof d.close === 'function') d.close();
    else d.removeAttribute('open');
  }

  document.querySelectorAll('[data-open]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      openDialog(document.getElementById(link.getAttribute('data-open')));
    });
  });

  document.querySelectorAll('dialog').forEach(function (d) {
    d.querySelector('.dialog-close').addEventListener('click', function () { closeDialog(d); });
    // Cerrar al pulsar fuera del contenido
    d.addEventListener('click', function (e) { if (e.target === d) closeDialog(d); });
  });

  // Visor de fotos
  var lightbox = document.getElementById('lightbox');
  if (lightbox) {
    var lbImg = lightbox.querySelector('img');
    document.querySelectorAll('.gallery-item').forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        var img = a.querySelector('img');
        lbImg.src = a.getAttribute('href');
        lbImg.alt = img ? img.alt : '';
        openDialog(lightbox);
      });
    });
  }

  // ---------- Animación al hacer scroll ----------
  if ('IntersectionObserver' in window) {
    var items = document.querySelectorAll('.section-head, .card, .gallery figure, .zone');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -40px 0px' });
    items.forEach(function (el) { el.classList.add('reveal'); io.observe(el); });
  }
})();
