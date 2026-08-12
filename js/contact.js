document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');

  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      form.style.display = 'none';
      if (success) {
        success.style.display = 'block';
        success.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }

  const runLucide = () => {
    if (window.lucide) {
      window.lucide.createIcons();
    } else {
      setTimeout(runLucide, 50);
    }
  };
  runLucide();
});
