const THEME_KEY = 'vp-theme';
const DIR_KEY = 'vp-dir';

function initDir() {
  const saved = localStorage.getItem(DIR_KEY) || 'ltr';
  document.documentElement.setAttribute('dir', saved);
  setTimeout(() => updateDirButtonLabel(saved), 100);
}

function toggleDir() {
  const current = document.documentElement.getAttribute('dir') || 'ltr';
  const next = current === 'rtl' ? 'ltr' : 'rtl';
  document.documentElement.setAttribute('dir', next);
  localStorage.setItem(DIR_KEY, next);
  updateDirButtonLabel(next);
  window.dispatchEvent(new CustomEvent('dir-changed', { detail: { dir: next } }));
}

function updateDirButtonLabel(dir) {
  const btn = document.getElementById('dirToggle');
  if (btn) {
    btn.textContent = dir === 'rtl' ? 'LTR' : 'RTL';
  }
}

function initTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = saved || (prefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', theme);
  window.dispatchEvent(new CustomEvent('theme-changed', { detail: { theme } }));
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem(THEME_KEY, next);
  window.dispatchEvent(new CustomEvent('theme-changed', { detail: { theme: next } }));
}

async function loadNavigation() {
  const headerEl = document.getElementById('header-placeholder');
  const footerEl = document.getElementById('footer-placeholder');
  const isRoot = !window.location.pathname.includes('/html/');
  const prefix = isRoot ? '' : '../';

  if (headerEl) {
    if (typeof HEADER_CONTENT !== 'undefined') {
      headerEl.innerHTML = HEADER_CONTENT;
      fixLinks(headerEl, isRoot);
    } else {
      try {
        const res = await fetch(prefix + 'navigation/header.html');
        if (res.ok) {
          headerEl.innerHTML = await res.text();
          fixLinks(headerEl, isRoot);
        }
      } catch(e) { console.warn('Header fetch failed'); }
    }
  }

  if (footerEl) {
    if (typeof FOOTER_CONTENT !== 'undefined') {
      footerEl.innerHTML = FOOTER_CONTENT;
      fixLinks(footerEl, isRoot);
    } else {
      try {
        const res = await fetch(prefix + 'navigation/footer.html');
        if (res.ok) {
          footerEl.innerHTML = await res.text();
          fixLinks(footerEl, isRoot);
        }
      } catch(e) { console.warn('Footer fetch failed'); }
    }
  }

  setupHeaderInteractions();
}

function fixLinks(container, isRoot) {
  const links = container.querySelectorAll('a');
  const secondaryPages = [
    'about.html', 'services.html', 'blogs.html', 'contact.html', 
    'pricing.html', 'dashboard.html', 'login.html', 'service-detail.html',
    'blog-detail.html', 'home2.html', 'coming-soon.html', '404.html', 'signup.html',
    'compostable-bags.html', 'eco-mailers.html', 'recyclable-boxes.html'
  ];

  links.forEach(link => {
    let href = link.getAttribute('href');
    if (!href || href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto:')) return;

    href = href.replace('../', '').replace('html/', '');

    if (isRoot) {
      if (secondaryPages.includes(href.split('?')[0].split('#')[0])) {
        link.setAttribute('href', 'html/' + href);
      }
    } else {
      if (href.startsWith('index.html')) {
        link.setAttribute('href', '../' + href);
      }
    }
  });
}

function setupHeaderInteractions() {
  const toggleBtn = document.getElementById('themeToggle');
  if (toggleBtn) toggleBtn.addEventListener('click', toggleTheme);

  const dirToggleBtn = document.getElementById('dirToggle');
  if (dirToggleBtn) {
    dirToggleBtn.addEventListener('click', toggleDir);
    updateDirButtonLabel(document.documentElement.getAttribute('dir') || 'ltr');
  }

  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileNav.classList.toggle('open');
    });
  }

  const header = document.getElementById('siteHeader');
  if (header) {
    window.addEventListener('scroll', () => {
      header.style.boxShadow = window.scrollY > 10 ? 'var(--shadow-lg)' : 'none';
    });
  }

  const path = window.location.pathname;
  const page = path.split('/').pop() || 'index.html';
  
  document.querySelectorAll('.nav-link, .mobile-nav-list a, .dropdown-item').forEach(link => {
    link.classList.remove('active');
    const href = link.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) {
      link.classList.add('active');
      const parentDropdown = link.closest('.has-dropdown');
      if (parentDropdown) {
        const parentLink = parentDropdown.querySelector('.nav-link');
        if (parentLink) parentLink.classList.add('active');
      }
    }
  });
}

function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
  });
}

initTheme();
initDir();

document.documentElement.style.scrollBehavior = "smooth";

document.addEventListener('DOMContentLoaded', () => {
  loadNavigation().then(() => {
    initScrollAnimations();
    setupSmoothNavigation();
    setupButtonFeedback();
  });
});

function setupSmoothNavigation() {
  const prefetchedLinks = new Set();
  
  document.querySelectorAll("a").forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.includes("#") || href.startsWith('mailto:') || href.startsWith('tel:') || link.target === "_blank") {
      return;
    }

    link.addEventListener('mouseenter', () => {
      if (!prefetchedLinks.has(href)) {
        const prefetchBtn = document.createElement('link');
        prefetchBtn.rel = 'prefetch';
        prefetchBtn.href = href;
        document.head.appendChild(prefetchBtn);
        prefetchedLinks.add(href);
      }
    }, { once: true });

    link.addEventListener("click", function(e) {
      e.preventDefault();
      
      document.body.style.transition = "opacity 0.25s ease, transform 0.25s ease";
      document.body.style.opacity = "0";
      document.body.style.transform = "translateY(-10px)";

      setTimeout(() => {
        window.location.href = href;
      }, 250);
    });
  });
}

function setupButtonFeedback() {
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("button, .btn-primary, .btn-outline, .btn-footer-sub, .details-btn");
    if (btn) {
      const originalTransform = btn.style.transform || "none";
      btn.style.transform = "scale(0.97)";
      setTimeout(() => {
        btn.style.transform = originalTransform === "none" ? "" : originalTransform;
      }, 150);
    }
  });
}

const globalCSS = `
body {
  animation: pageFadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes pageFadeIn {
  0% { opacity: 0; transform: translateY(10px); }
  100% { opacity: 1; transform: translateY(0); }
}

.animate-on-scroll { opacity: 0; transform: translateY(30px); transition: opacity 0.6s ease, transform 0.6s ease; }
.animate-on-scroll.delay-1 { transition-delay: 0.1s; }
.animate-on-scroll.delay-2 { transition-delay: 0.2s; }
.animate-on-scroll.delay-3 { transition-delay: 0.3s; }
.animate-on-scroll.delay-4 { transition-delay: 0.4s; }
.animate-on-scroll.visible { opacity: 1; transform: none; }
@media (prefers-reduced-motion: reduce) {
  .animate-on-scroll { opacity: 1; transform: none; transition: none; }
}

html, body {
  width: 100%;
  max-width: 100vw;
  overflow-x: hidden;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

*, *:before, *:after {
  box-sizing: inherit;
}

.container {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 20px;
}

@media (max-width: 768px) {
  .container { padding: 0 16px; }
  
  [style*="grid-template-columns"],
  .grid, .advantage-grid, .blog-grid, .impact-grid, .lifecycle-grid, 
  .steps-grid, .split-layout, .contact-layout, .form-row,
  .hero .container, .hero-container, .hero-actions, .hero-stats {
    grid-template-columns: 1fr !important;
    display: flex !important;
    flex-direction: column !important;
    gap: 32px !important;
  }

  .hero-visual, .split-visual, .advantage-img, .impact-visual, .lifecycle-visual, .split-right {
    order: -1 !important;
    width: 100% !important;
  }

  .hero-content, .split-content, .advantage-card, .impact-text, .lifecycle-text, .split-left {
    width: 100% !important;
    order: 1 !important;
  }

  .blog-card {
    width: 100% !important;
    margin-bottom: 24px;
  }

  .address-sidebar {
    order: 2 !important;
  }
  .contact-form-card {
    order: 1 !important;
  }

  h1 { font-size: 2.2rem !important; }
  h2 { font-size: 1.8rem !important; }
  
  .hero { padding-top: 80px !important; min-height: auto !important; }
  
  img {
    height: auto !important;
    max-height: 400px;
    object-fit: cover;
    margin: 0 auto;
  }
}

@media (max-width: 1024px) {
  .header-actions .btn-outline-sm, 
  .header-actions .btn-primary-sm {
    display: none !important;
  }
}
`;
const style = document.createElement('style');
style.textContent = globalCSS;
document.head.appendChild(style);