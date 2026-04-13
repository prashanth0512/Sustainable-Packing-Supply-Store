document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const serviceId = params.get('service') || 'compostable';
  const isSubfolder = window.location.pathname.includes('/html/');
  const data = SERVICES_DATA[serviceId];

  if (data) {
    const prefix = isSubfolder ? '../' : '';
    document.title = `${data.title} — VerdantPack`;
    const breadcrumbCurrent = document.querySelector('.breadcrumb span:last-child');
    if (breadcrumbCurrent) breadcrumbCurrent.textContent = data.title;

    const mainImg = document.getElementById('mainDetailImg');
    if (mainImg) {
      mainImg.src = prefix + data.image;
      mainImg.alt = data.title;
    }

    const titleEl = document.querySelector('.detail-info h1');
    if (titleEl) titleEl.textContent = data.title;

    const tagEl = document.querySelector('.product-category-tag');
    if (tagEl) tagEl.textContent = `🌿 ${data.category}`;

    const badgeEl = document.querySelector('.cert-tag');
    if (badgeEl) badgeEl.textContent = data.tag;

    const priceEl = document.querySelector('.price-main strong');
    if (priceEl) priceEl.textContent = data.price;

    const descEl = document.querySelector('.detail-desc');
    if (descEl) descEl.textContent = data.description;

    const specsTable = document.querySelector('.specs-table');
    if (specsTable && data.specs) {
      specsTable.innerHTML = data.specs.map(s => `<tr><td>${s.label}</td><td>${s.value}</td></tr>`).join('');
    }
    const faqList = document.querySelector('.faq-list');
    if (faqList && data.faqs && data.faqs.length > 0) {
      faqList.innerHTML = data.faqs.map(f => `<div class="faq-item"><strong>${f.q}</strong><p>${f.a}</p></div>`).join('');
    }
  }

  const tabs = document.querySelectorAll('.detail-tab');
  const contents = document.querySelectorAll('.tab-content');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      contents.forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      const target = document.getElementById('tab-' + (tab.dataset.tab || 'specs'));
      if (target) target.classList.add('active');
    });
  });

  let qty = 500;
  const priceVal = data ? parseFloat(data.price.replace('$', '')) : 0.22;
  const display = document.getElementById('qtyDisplay');
  const total = document.getElementById('qtyTotal');

  function updateTotal() {
    if (display) display.textContent = qty.toLocaleString();
    if (total) total.textContent = '$' + (qty * priceVal).toFixed(2);
  }

  document.getElementById('qtyMinus')?.addEventListener('click', () => {
    if (qty > 500) { qty -= 500; updateTotal(); }
  });
  document.getElementById('qtyPlus')?.addEventListener('click', () => {
    qty += 500; updateTotal();
  });
  
  updateTotal();
});