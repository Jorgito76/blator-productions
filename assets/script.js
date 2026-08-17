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

  // ===== Phone number formatting and validation =====
  var phoneField = document.querySelector('#phone-field');
  if (phoneField) {
    // Only allow digits during input
    phoneField.addEventListener('keypress', function (e) {
      var char = String.fromCharCode(e.which);
      if (!/[0-9]/.test(char)) {
        e.preventDefault();
      }
    });

    // Prevent non-numeric paste
    phoneField.addEventListener('paste', function (e) {
      e.preventDefault();
      var pastedText = (e.clipboardData || window.clipboardData).getData('text');
      var digitsOnly = pastedText.replace(/\D/g, '').slice(0, 10);
      phoneField.value = formatPhoneNumber(digitsOnly);
    });

    // Format as user types
    phoneField.addEventListener('input', function () {
      var digitsOnly = this.value.replace(/\D/g, '').slice(0, 10);
      this.value = formatPhoneNumber(digitsOnly);
    });
  }

  function formatPhoneNumber(digits) {
    if (!digits) return '';
    if (digits.length <= 3) {
      return digits.length > 0 ? '(' + digits : '';
    } else if (digits.length <= 6) {
      return '(' + digits.slice(0, 3) + ') ' + digits.slice(3);
    } else {
      return '(' + digits.slice(0, 3) + ') ' + digits.slice(3, 6) + '-' + digits.slice(6, 10);
    }
  }

  // ===== Contact form validation =====
  var form = document.querySelector('#inquiry-form');
  var eventTypeSelect = document.querySelector('#event-type');
  var otherTypeContainer = document.querySelector('#other-type-container');
  var eventDateInput = document.querySelector('#event-date');
  var dateErrorMessage = document.querySelector('#date-error');

  // Toggle "Other" specification field visibility
  if (eventTypeSelect) {
    eventTypeSelect.addEventListener('change', function () {
      if (this.value === 'Other') {
        otherTypeContainer.style.display = 'block';
      } else {
        otherTypeContainer.style.display = 'none';
      }
    });
  }

  // Validate event date on change
  if (eventDateInput) {
    eventDateInput.addEventListener('change', function () {
      validateEventDate(this.value);
    });
  }

  function validateEventDate(dateString) {
    dateErrorMessage.textContent = '';
    dateErrorMessage.style.color = '#d32f2f';

    if (!dateString) {
      dateErrorMessage.textContent = 'Event date is required.';
      return false;
    }

    var selectedDate = new Date(dateString);
    var today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      dateErrorMessage.textContent = 'Event date cannot be in the past. Please select a future date.';
      eventDateInput.value = '';
      return false;
    }

    return true;
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Validate event date
      var eventDateValue = eventDateInput.value;
      if (!validateEventDate(eventDateValue)) {
        return false;
      }

      // Validate required fields
      var nameField = document.querySelector('#name-field');
      var emailField = document.querySelector('#email-field');

      if (!nameField.value.trim()) {
        alert('Please enter your name.');
        nameField.focus();
        return false;
      }

      if (!emailField.value.trim()) {
        alert('Please enter your email.');
        emailField.focus();
        return false;
      }

      if (!eventTypeSelect.value) {
        alert('Please select an event type.');
        eventTypeSelect.focus();
        return false;
      }

      // Validate phone number if provided
      var phoneValue = phoneField.value.replace(/\D/g, '');
      if (phoneValue.length > 0 && phoneValue.length !== 10) {
        alert('Please enter a valid 10-digit phone number.');
        phoneField.focus();
        return false;
      }

      // If "Other" is selected, it's optional but can be filled
      // Form is ready to submit
      var status = document.querySelector('.form-status');
      if (status) {
        status.style.display = 'block';
        status.textContent = "Thank you! Your inquiry has been sent. We'll be in touch soon.";
        status.style.color = '#4caf50';
      }

      // TODO: Connect to Formspree or Netlify Forms
      // For now, this just shows a success message
      // this.submit(); // Uncomment when connected to email service
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
