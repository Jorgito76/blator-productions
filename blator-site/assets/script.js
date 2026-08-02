// ===== Mobile nav toggle =====
document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('nav.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('open');
    });
  }

  // ===== FAQ accordion =====
  document.querySelectorAll('.faq-item h3').forEach(function (heading) {
    heading.addEventListener('click', function () {
      heading.parentElement.classList.toggle('open');
    });
  });

  // ===== Gallery filter pills =====
  var pills = document.querySelectorAll('.filter-pill');
  if (pills.length) {
    pills.forEach(function (pill) {
      pill.addEventListener('click', function () {
        pills.forEach(function (p) { p.classList.remove('active'); });
        pill.classList.add('active');
        var filter = pill.getAttribute('data-filter');
        document.querySelectorAll('.masonry-tile').forEach(function (tile) {
          if (filter === 'all' || tile.getAttribute('data-category') === filter) {
            tile.classList.remove('hidden');
          } else {
            tile.classList.add('hidden');
          }
        });
      });
    });
  }

  // ===== Video thumbnails (placeholder click behavior) =====
  document.querySelectorAll('.video-thumb, .featured-frame').forEach(function (v) {
    v.addEventListener('click', function () {
      // Replace this with an actual video embed (YouTube/Vimeo iframe) or lightbox.
      console.log('Video placeholder clicked — swap in a real embed here.');
    });
  });

  // ===== Contact form (placeholder submit handling) =====
  var form = document.querySelector('#inquiry-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      // This form is not yet connected to an email service.
      // Easiest options: Formspree (formspree.io) or Netlify Forms if hosting on Netlify.
      // Once connected, remove this placeholder and let the form submit normally.
      var status = document.querySelector('.form-status');
      if (status) {
        status.style.display = 'block';
        status.textContent = "This form isn't connected yet — see the comment in script.js for how to hook it up.";
      }
    });
  }

  // ===== EN / ES language toggle =====
  var langButtons = document.querySelectorAll('.lang-toggle button');
  var savedLang = localStorage.getItem('blator-lang') || 'en';
  applyLanguage(savedLang);

  langButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var lang = btn.getAttribute('data-lang');
      localStorage.setItem('blator-lang', lang);
      applyLanguage(lang);
    });
  });

  function applyLanguage(lang) {
    langButtons.forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });
    document.querySelectorAll('[data-en]').forEach(function (el) {
      var text = el.getAttribute('data-' + lang);
      if (text) { el.textContent = text; }
    });
    document.documentElement.setAttribute('lang', lang);
  }
});
