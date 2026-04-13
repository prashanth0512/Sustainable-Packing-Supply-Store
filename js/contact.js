document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      form.style.display = 'none';
      if (success) success.style.display = 'block';
    });
  }

  const faqTriggers = document.querySelectorAll('.faq-trigger');
  faqTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const content = trigger.nextElementSibling;
      const plus = trigger.querySelector('.faq-plus');
      const isOpen = content.style.display === 'block';

      document.querySelectorAll('.faq-content-acc').forEach(c => c.style.display = 'none');
      document.querySelectorAll('.faq-plus').forEach(p => p.textContent = '+');

      if (!isOpen) {
        content.style.display = 'block';
        if (plus) plus.textContent = '−';
      } else {
        content.style.display = 'none';
        if (plus) plus.textContent = '+';
      }
    });
  });
});