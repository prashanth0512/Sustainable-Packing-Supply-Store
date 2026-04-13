document.addEventListener('DOMContentLoaded', () => {
  const monthlyBtn = document.getElementById('monthlyBtn');
  const annualBtn = document.getElementById('annualBtn');

  function setPricing(mode) {
    document.querySelectorAll('.price-amount[data-monthly]').forEach(el => {
      const val = el.getAttribute('data-' + mode);
      if (!isNaN(val)) el.textContent = val;
    });
  }

  monthlyBtn?.addEventListener('click', () => {
    monthlyBtn.classList.add('active');
    annualBtn.classList.remove('active');
    setPricing('monthly');
  });

  annualBtn?.addEventListener('click', () => {
    annualBtn.classList.add('active');
    monthlyBtn.classList.remove('active');
    setPricing('annual');
  });

  document.querySelectorAll('.faq-question').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.parentElement;
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item-acc').forEach(i => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });
});