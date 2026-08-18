document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const path = window.location.pathname;
  let defaultService = 'compostable';
  if (path.includes('eco-mailers')) defaultService = 'mailers';
  else if (path.includes('recyclable-boxes')) defaultService = 'recyclable';
  else if (path.includes('compostable-bags')) defaultService = 'compostable';
  const serviceId = params.get('service') || defaultService;
  const data = SERVICES_DATA[serviceId];
  if (!data) {
    console.error('Service data not found for ID:', serviceId);
    return;
  }
  function getAssetPath(url) {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//')) {
      return url;
    }
    const isSubfolder = window.location.pathname.includes('/html/');
    return (isSubfolder ? '../' : '') + url;
  }
  document.title = `${data.title} — Premium Sustainable Packaging | VerdantPack`;
  const heroBg = document.getElementById('heroBg');
  if (heroBg) heroBg.style.backgroundImage = `url('${getAssetPath(data.heroBg)}')`;
  const heroBadge = document.getElementById('heroBadge');
  if (heroBadge) {
    heroBadge.innerHTML = `<i data-lucide="leaf" class="icon-sm"></i> ${data.heroBadge || data.tag}`;
  }
  const heroTitle = document.getElementById('heroTitle');
  if (heroTitle) heroTitle.textContent = data.title;
  const heroSubtitle = document.getElementById('heroSubtitle');
  if (heroSubtitle) heroSubtitle.textContent = data.heroSubtitle || data.description;
  const usedIn = document.getElementById('usedIn');
  if (usedIn) usedIn.textContent = data.usedIn;
  const overviewImg = document.getElementById('overviewImg');
  if (overviewImg) {
    overviewImg.src = getAssetPath(data.overviewImg || data.image);
    overviewImg.alt = data.title;
  }
  const overviewHeading = document.getElementById('overviewHeading');
  if (overviewHeading) overviewHeading.textContent = data.overviewHeading || `Custom Engineered ${data.title}`;
  const overviewDesc = document.getElementById('overviewDesc');
  if (overviewDesc) overviewDesc.textContent = data.overviewDesc || data.description;
  const benefitsGrid = document.getElementById('benefitsGrid');
  if (benefitsGrid && data.benefits) {
    benefitsGrid.innerHTML = data.benefits.map(b => `
      <div class="benefit-card">
        <div class="benefit-icon">
          <i data-lucide="${b.icon}"></i>
        </div>
        <div class="benefit-info">
          <h4>${b.title}</h4>
          <p>${b.desc}</p>
        </div>
      </div>
    `).join('');
  }
  const industriesList = document.getElementById('industriesList');
  if (industriesList && data.industries) {
    industriesList.innerHTML = data.industries.map(ind => `
      <span class="industry-tag">${ind}</span>
    `).join('');
  }
  const detailsGrid = document.getElementById('detailsGrid');
  if (detailsGrid && data.details) {
    const d = data.details;
    detailsGrid.innerHTML = `
      <div class="detail-card">
        <div class="detail-card-header">
          <span class="card-icon"><i data-lucide="sprout"></i></span>
          <h3>Material & Origin</h3>
        </div>
        <p>${d.materials}</p>
      </div>
      <div class="detail-card">
        <div class="detail-card-header">
          <span class="card-icon"><i data-lucide="leaf"></i></span>
          <h3>Sustainability Profile</h3>
        </div>
        <p>${d.sustainability}</p>
      </div>
      <div class="detail-card">
        <div class="detail-card-header">
          <span class="card-icon"><i data-lucide="shield"></i></span>
          <h3>Structural Strength</h3>
        </div>
        <p>${d.strength}</p>
      </div>
      <div class="detail-card">
        <div class="detail-card-header">
          <span class="card-icon"><i data-lucide="maximize-2"></i></span>
          <h3>Standard Dimensions</h3>
        </div>
        <p>${d.sizes}</p>
      </div>
      <div class="detail-card">
        <div class="detail-card-header">
          <span class="card-icon"><i data-lucide="palette"></i></span>
          <h3>Printing Options</h3>
        </div>
        <p>${d.printing}</p>
      </div>
      <div class="detail-card">
        <div class="detail-card-header">
          <span class="card-icon"><i data-lucide="edit-3"></i></span>
          <h3>Custom Branding</h3>
        </div>
        <p>${d.branding}</p>
      </div>
      <div class="detail-card">
        <div class="detail-card-header">
          <span class="card-icon"><i data-lucide="award"></i></span>
          <h3>Eco Certifications</h3>
        </div>
        <ul>
          ${d.certifications.map(c => `<li>${c}</li>`).join('')}
        </ul>
      </div>
      <div class="detail-card">
        <div class="detail-card-header">
          <span class="card-icon"><i data-lucide="globe"></i></span>
          <h3>Eco-Friendly Advantages</h3>
        </div>
        <p>${d.advantages}</p>
      </div>
      <div class="detail-card">
        <div class="detail-card-header">
          <span class="card-icon"><i data-lucide="check-circle"></i></span>
          <h3>Core Attributes</h3>
        </div>
        <ul>
          ${d.features.map(f => `<li>${f}</li>`).join('')}
        </ul>
      </div>
    `;
  }
  const timelineSteps = document.getElementById('timelineSteps');
  const timelineProgress = document.getElementById('timelineProgress');
  if (timelineSteps && data.timeline) {
    timelineSteps.innerHTML = data.timeline.map((step, idx) => `
      <div class="timeline-card ${idx === 0 ? 'active' : ''}" data-step="${idx}">
        <div class="timeline-node">
          <i data-lucide="${step.icon}"></i>
        </div>
        <h4>${step.title}</h4>
        <p>${step.desc}</p>
      </div>
    `).join('');
    const cards = timelineSteps.querySelectorAll('.timeline-card');
    cards.forEach((card, index) => {
      card.addEventListener('mouseenter', () => {
        cards.forEach((c, idx) => {
          if (idx <= index) {
            c.classList.add('active');
          } else {
            c.classList.remove('active');
          }
        });
        if (timelineProgress) {
          const percent = (index / (cards.length - 1)) * 100;
          timelineProgress.style.width = `${percent}%`;
        }
      });
    });
  }
  const pricingGrid = document.getElementById('pricingGrid');
  if (pricingGrid && data.pricing) {
    pricingGrid.innerHTML = data.pricing.map((plan, idx) => `
      <div class="pricing-card ${plan.isEnterprise ? 'featured' : ''}">
        <div class="price-header">
          <h3>${plan.name}</h3>
          <div class="price">${plan.price}<span>/${plan.unit}</span></div>
          <p>${plan.branding}</p>
        </div>
        <div class="price-specs">
          <div>MOQ: <span>${plan.moq}</span></div>
          <div>Delivery: <span>${plan.delivery}</span></div>
        </div>
        <ul class="price-features">
          ${plan.features.map(f => `
            <li><i data-lucide="check" class="icon-sm"></i> ${f}</li>
          `).join('')}
        </ul>
        <a href="${plan.isEnterprise ? 'contact.html' : 'login.html'}" class="${plan.isEnterprise ? 'btn-primary' : 'btn-outline'}">
          ${plan.isEnterprise ? 'Contact Enterprise' : 'Order Now'} <i data-lucide="arrow-right" class="icon-sm"></i>
        </a>
      </div>
    `).join('');
  }
  const galleryGrid = document.getElementById('galleryGrid');
  if (galleryGrid && data.gallery) {
    galleryGrid.innerHTML = data.gallery.map(item => `
      <div class="gallery-item">
        <img src="${getAssetPath(item.image)}" alt="${item.caption}">
        <div class="gallery-overlay">
          <div class="gallery-icon-wrap">
            <i data-lucide="zoom-in"></i>
          </div>
          <h4>${item.caption}</h4>
          <p>${data.title}</p>
        </div>
      </div>
    `).join('');
  }
  const faqAccordion = document.getElementById('faqAccordion');
  if (faqAccordion && data.faqs) {
    faqAccordion.innerHTML = data.faqs.map(faq => `
      <div class="faq-card">
        <div class="faq-header">
          <h3>${faq.q}</h3>
          <div class="faq-trigger-icon">+</div>
        </div>
        <div class="faq-body">
          <div class="faq-content">
            <p>${faq.a}</p>
          </div>
        </div>
      </div>
    `).join('');
    const faqCards = faqAccordion.querySelectorAll('.faq-card');
    faqCards.forEach(card => {
      const header = card.querySelector('.faq-header');
      const body = card.querySelector('.faq-body');
      header.addEventListener('click', () => {
        const isActive = card.classList.contains('active');
        faqCards.forEach(c => {
          c.classList.remove('active');
          c.querySelector('.faq-body').style.maxHeight = null;
        });
        if (!isActive) {
          card.classList.add('active');
          body.style.maxHeight = body.scrollHeight + "px";
        }
      });
    });
  }
  const relatedGrid = document.getElementById('relatedGrid');
  if (relatedGrid) {
    const keys = Object.keys(SERVICES_DATA).filter(k => k !== serviceId);
    const selectedKeys = keys.slice(0, 3);
    relatedGrid.innerHTML = selectedKeys.map(key => {
      const item = SERVICES_DATA[key];
      const detailLink = (window.location.pathname.includes('/html/') ? '' : 'html/') + 'service-detail.html?service=' + key;
      return `
        <div class="related-card" onclick="window.location.href='${detailLink}'">
          <div class="related-card-img">
            <img src="${getAssetPath(item.image)}" alt="${item.title}">
            <span class="related-card-tag">${item.category}</span>
          </div>
          <div class="related-card-body">
            <div class="related-card-text">
              <h3>${item.title}</h3>
              <p>${item.description || item.heroSubtitle}</p>
            </div>
            <div class="related-card-footer">
              <div class="related-card-price">From <strong>${item.price}</strong></div>
              <button class="btn-primary-sm" onclick="event.stopPropagation(); window.location.href='${detailLink}'">
                Learn More <i data-lucide="arrow-right" class="icon-sm"></i>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }
  setTimeout(() => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, 100);
});
