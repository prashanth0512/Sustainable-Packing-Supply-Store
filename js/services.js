document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.filter-tab');
  const cards = document.querySelectorAll('.product-card');

  const params = new URLSearchParams(window.location.search);
  const categoryParam = params.get('category');
  if (categoryParam) {
    const targetTab = Array.from(tabs).find(t => t.dataset.filter === categoryParam);
    if (targetTab) targetTab.click();
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.dataset.filter;
      cards.forEach(card => {
        const cat = card.dataset.category;
        if (filter === 'all' || cat === filter) {
          card.style.display = 'grid';
          card.style.animation = 'fadeInUp 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });

      const newUrl = filter === 'all' ? 'services.html' : `services.html?category=${filter}`;
      window.history.pushState({ path: newUrl }, '', newUrl);
    });
  });
  document.querySelectorAll(".details-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const service = btn.getAttribute("data-service");
      const isSubfolder = window.location.pathname.includes('/html/');
      const pageName = 'service-detail.html';
      window.location.href = (isSubfolder ? '' : 'html/') + pageName + '?service=' + service;
    });
  });

  cards.forEach(card => {
    const serviceId = card.getAttribute('data-service');
    card.addEventListener('click', (e) => {
      if (e.target.closest('button')) return;
      const isSubfolder = window.location.pathname.includes('/html/');
      const pageName = 'service-detail.html';
      window.location.href = (isSubfolder ? '' : 'html/') + pageName + '?service=' + serviceId;
    });
  });

  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    const icon = item.querySelector('.faq-icon');

    question.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = item.classList.contains('active');
      
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        otherItem.querySelector('.faq-answer').style.maxHeight = '0';
        otherItem.querySelector('.faq-icon').textContent = '+';
      });

      if (!isOpen) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        icon.textContent = '-';
      }
    });
  });
});

const filterCSS = `
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.product-card.hidden { display: none !important; }
`;
const s = document.createElement('style');
s.textContent = filterCSS;
document.head.appendChild(s);