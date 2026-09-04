// ===== Mobile nav toggle =====
document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('nav.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('open');
    });

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
      });
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
    if (!dateErrorMessage) return true;
    dateErrorMessage.textContent = '';
    dateErrorMessage.style.color = '#d32f2f';

    if (!dateString) {
      dateErrorMessage.textContent = 'Event date is required.';
      return false;
    }

    var parts = dateString.split('-');
    if (parts.length === 3) {
      var selectedDate = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
      var today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        dateErrorMessage.textContent = 'Event date cannot be in the past. Please select an upcoming date.';
        if (eventDateInput) eventDateInput.value = '';
        return false;
      }
    }

    return true;
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      // Validate event date
      var eventDateValue = eventDateInput ? eventDateInput.value : '';
      if (!validateEventDate(eventDateValue)) {
        e.preventDefault();
        e.stopImmediatePropagation();
        return false;
      }

      // Validate required fields
      var nameField = document.querySelector('#name-field');
      var emailField = document.querySelector('#email-field');

      if (!nameField || !nameField.value.trim()) {
        alert('Please enter your name.');
        if (nameField) nameField.focus();
        e.preventDefault();
        e.stopImmediatePropagation();
        return false;
      }

      if (!emailField || !emailField.value.trim()) {
        alert('Please enter your email.');
        if (emailField) emailField.focus();
        e.preventDefault();
        e.stopImmediatePropagation();
        return false;
      }

      if (!eventTypeSelect || !eventTypeSelect.value) {
        alert('Please select an event type.');
        if (eventTypeSelect) eventTypeSelect.focus();
        e.preventDefault();
        e.stopImmediatePropagation();
        return false;
      }

      // Validate phone number if provided
      if (phoneField) {
        var phoneValue = phoneField.value.replace(/\D/g, '');
        if (phoneValue.length > 0 && phoneValue.length !== 10) {
          alert('Please enter a valid 10-digit phone number.');
          phoneField.focus();
          e.preventDefault();
          e.stopImmediatePropagation();
          return false;
        }
      }

      // Form is valid - let Formspree or native form submission handle the post
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
      if (text !== null && text !== undefined) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          if (el.hasAttribute('placeholder')) {
            el.setAttribute('placeholder', text);
          }
        } else {
          el.innerHTML = text;
        }
      }
    });
    document.querySelectorAll('[data-en-placeholder]').forEach(function (el) {
      var ph = el.getAttribute('data-' + lang + '-placeholder');
      if (ph) {
        el.setAttribute('placeholder', ph);
      }
    });
    document.documentElement.setAttribute('lang', lang);
  }
});
