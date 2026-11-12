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

  // ---------- Formulario de contacto ----------
  var form = document.getElementById('contact-form');
  if (!form) return;
  var status = form.querySelector('.form-status');

  function setStatus(msg, type) {
    status.textContent = msg;
    status.className = 'form-status' + (type ? ' ' + type : '');
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Validación sencilla
    var valid = true;
    form.querySelectorAll('[required]').forEach(function (field) {
      var ok = field.type === 'checkbox' ? field.checked : field.checkValidity();
      field.classList.toggle('invalid', !ok);
      if (!ok) valid = false;
    });
    if (!valid) {
      setStatus('Revisa los campos marcados con * y acepta la política de privacidad.', 'error');
      var first = form.querySelector('.invalid');
      if (first) first.focus();
      return;
    }

    var data = new FormData(form);
    if (data.get('_gotcha')) return; // spam

    var endpoint = form.getAttribute('data-endpoint');
    var btn = form.querySelector('button[type="submit"]');

    // Opción A: servicio de formularios (Formspree u otro) si está configurado
    if (endpoint) {
      btn.disabled = true;
      setStatus('Enviando…');
      fetch(endpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' } })
        .then(function (res) {
          if (!res.ok) throw new Error('Error ' + res.status);
          form.reset();
          setStatus('¡Gracias! Hemos recibido tu mensaje y te contactaremos pronto.', 'ok');
        })
        .catch(function () {
          setStatus('No se pudo enviar. Llámanos al 624 134 152 o escríbenos por WhatsApp.', 'error');
        })
        .finally(function () { btn.disabled = false; });
      return;
    }

    // Opción B (por defecto): abrir el correo del cliente con el mensaje ya redactado
    var to = form.getAttribute('data-email');
    var subject = 'Solicitud de presupuesto – ' + data.get('service');
    var body =
      'Nombre: ' + data.get('name') + '\n' +
      'Teléfono: ' + data.get('phone') + '\n' +
      'Email: ' + (data.get('email') || '-') + '\n' +
      'Servicio: ' + data.get('service') + '\n\n' +
      data.get('message');
    window.location.href = 'mailto:' + to + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    setStatus('Se abrirá tu aplicación de correo para enviar el mensaje. Si no se abre, escríbenos por WhatsApp.', 'ok');
  });

  // Quitar el rojo al corregir un campo
  form.addEventListener('input', function (e) {
    if (e.target.classList.contains('invalid') && (e.target.type === 'checkbox' ? e.target.checked : e.target.checkValidity())) {
      e.target.classList.remove('invalid');
    }
  });
})();
