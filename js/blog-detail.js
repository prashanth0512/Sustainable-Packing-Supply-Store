document.addEventListener('DOMContentLoaded', () => {
  if (typeof BLOGS_DATA === 'undefined') {
    console.error('BLOGS_DATA is not defined. Make sure navigation-data.js is loaded.');
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const postId = params.get('post') || 'plastic-cost';
  const data = BLOGS_DATA[postId] || BLOGS_DATA['plastic-cost'];
  const authorAvatars = {
    'Marcus Okafor': '../assets/images/avatar-marcus.png',
    'Sarah Jenkins': '../assets/images/avatar-sarah.png',
    'David Chen': '../assets/images/avatar-jamie.png',
    'Dr. Elena Rossi': '../assets/images/avatar-sarah.png',
    'Sofia Nakamura': '../assets/images/avatar-anika.png',
    'Jamie Rivera': '../assets/images/avatar-jamie.png'
  };

  const authorRoles = {
    'Marcus Okafor': 'Head of Sustainability',
    'Sarah Jenkins': 'Bio-Polymer Scientist',
    'David Chen': 'Chief Procurement Architect',
    'Dr. Elena Rossi': 'Materials Architect',
    'Sofia Nakamura': 'Fulfillment Engineer',
    'Jamie Rivera': 'B-Corp Lead Auditor'
  };

  if (data) {
    document.title = `${data.title} — VerdantPack`;

    const heroOverlay = document.getElementById('heroOverlay');
    if (heroOverlay) {
      heroOverlay.style.backgroundImage = `url('../${data.image}')`;
    }

    const heroBadge = document.getElementById('heroBadge');
    if (heroBadge) heroBadge.textContent = data.tag;

    function formatHeroTitle(rawTitle) {
      if (!rawTitle) return '';
      const titleAccents = {
        'plastic-cost': 'The True Cost of Plastic Packaging: A Business Case for Going <span class="hero-accent">Compostable</span>',
        'composting-labels': 'Home vs. Industrial <span class="hero-accent">Composting</span>: What Your Labels Actually Mean',
        'negotiation': 'How to Negotiate <span class="hero-accent">Volume Pricing</span> with Packaging Suppliers',
        'pbat-vs-pla': '<span class="hero-accent">PBAT vs. PLA</span>: Which Compostable Polymer Is Right for Your Business?',
        'ai-fulfillment': 'The Future of Eco-Fulfillment: How AI is Reducing <span class="hero-accent">Packaging Waste</span>',
        'bcorp-guide': '<span class="hero-accent">B-Corp Certification</span> Guide: Step-by-Step for Sustainable Brands',
        'eco-logistics': 'Decentralized <span class="hero-accent">Eco-Logistics</span>: Slashing Shipping Costs & <span class="hero-accent">Emissions</span>'
      };

      if (titleAccents[postId]) {
        return titleAccents[postId];
      }

      const words = rawTitle.trim().split(/\s+/);
      if (words.length > 3) {
        let count = 0;
        for (let i = words.length - 1; i >= 0; i--) {
          const clean = words[i].replace(/[^a-zA-Z]/g, '');
          if (clean.length >= 5 && !/^\d+$/.test(clean)) {
            words[i] = `<span class="hero-accent">${words[i]}</span>`;
            count++;
            if (count >= 1) break;
          }
        }
        return words.join(' ');
      }
      return rawTitle;
    }

    const heroTitle = document.getElementById('heroTitle');
    if (heroTitle) heroTitle.innerHTML = formatHeroTitle(data.title);

    const heroSubtitle = document.getElementById('heroSubtitle');
    if (heroSubtitle) heroSubtitle.textContent = data.subtitle;

    const avatarPath = authorAvatars[data.author] || '../assets/images/avatar-marcus.png';
    const heroAuthorAvatar = document.getElementById('heroAuthorAvatar');
    if (heroAuthorAvatar) heroAuthorAvatar.src = avatarPath;

    const heroAuthorName = document.getElementById('heroAuthorName');
    if (heroAuthorName) heroAuthorName.textContent = data.author;

    const heroPublishDate = document.getElementById('heroPublishDate');
    if (heroPublishDate) heroPublishDate.textContent = data.date;

    const heroReadTime = document.getElementById('heroReadTime');
    if (heroReadTime) heroReadTime.textContent = data.readTime;

    const featureImg = document.getElementById('featureImg');
    if (featureImg) featureImg.src = `../${data.image}`;

    function formatArticleRichText(contentHtml) {
      if (!contentHtml) return '';
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = contentHtml;

      const headings = tempDiv.querySelectorAll('h2, h3');
      headings.forEach(h => {
        const rawText = h.textContent.trim();
        const words = rawText.split(/\s+/);
        if (words.length <= 5) {
          let targetIdx = words.length - 1;
          for (let i = words.length - 1; i >= 0; i--) {
            const cleanWord = words[i].replace(/[^a-zA-Z]/g, '');
            if (cleanWord.length >= 4 && !/^\d+$/.test(cleanWord)) {
              targetIdx = i;
              break;
            }
          }
          words[targetIdx] = `<span class="accent-text">${words[targetIdx]}</span>`;
          h.innerHTML = words.join(' ');
        } else {
          let highlighted = 0;
          for (let i = 0; i < words.length; i++) {
            const cleanWord = words[i].replace(/[^a-zA-Z]/g, '');
            if (cleanWord.length >= 4 && !/^\d+$/.test(cleanWord)) {
              words[i] = `<span class="accent-text">${words[i]}</span>`;
              highlighted++;
              if (highlighted >= 2) break;
            }
          }
          h.innerHTML = words.join(' ');
        }
      });

      const paragraphs = tempDiv.querySelectorAll('p');
      const keywords = [
        'Sustainable', 'Packaging', 'Carbon Neutral', 'Eco Materials',
        'Compostable', 'Circular Economy', 'Recyclable', 'Supply Chain'
      ];
      const keywordCounts = {};
      keywords.forEach(k => keywordCounts[k.toLowerCase()] = 0);

      paragraphs.forEach(p => {
        let text = p.innerHTML;
        keywords.forEach(kw => {
          const lowerKw = kw.toLowerCase();
          if (keywordCounts[lowerKw] < 2) {
            const regex = new RegExp(`\\b(${kw})\\b`, 'i');
            if (regex.test(text)) {
              text = text.replace(regex, '<span class="highlight-keyword">$1</span>');
              keywordCounts[lowerKw]++;
            }
          }
        });
        p.innerHTML = text;
      });

      return tempDiv.innerHTML;
    }

    const articleRichText = document.getElementById('articleRichText');
    if (articleRichText) articleRichText.innerHTML = formatArticleRichText(data.content);

    const quoteText = document.getElementById('quoteText');
    if (quoteText) quoteText.textContent = data.quote.text;

    const quoteAuthor = document.getElementById('quoteAuthor');
    if (quoteAuthor) quoteAuthor.textContent = `- ${data.quote.author}`;

    const statsGrid = document.getElementById('statsGrid');
    if (statsGrid && data.stats) {
      statsGrid.innerHTML = data.stats.map(s => `
        <div class="bd-stat-card">
          <div class="bd-stat-value">${s.value}</div>
          <div class="bd-stat-label">${s.label}</div>
          <div class="bd-stat-desc">${s.desc}</div>
        </div>
      `).join('');
    }

    const tipsList = document.getElementById('tipsList');
    if (tipsList && data.tips) {
      tipsList.innerHTML = data.tips.map(t => `<li>${t}</li>`).join('');
    }
    const practicesList = document.getElementById('practicesList');
    if (practicesList && data.bestPractices) {
      practicesList.innerHTML = data.bestPractices.map(bp => `<li>${bp}</li>`).join('');
    }
    const insightsText = document.getElementById('insightsText');
    if (insightsText) insightsText.textContent = data.insights;

    const sidebarAuthorAvatar = document.getElementById('sidebarAuthorAvatar');
    if (sidebarAuthorAvatar) sidebarAuthorAvatar.src = avatarPath;

    const sidebarAuthorName = document.getElementById('sidebarAuthorName');
    if (sidebarAuthorName) sidebarAuthorName.textContent = data.author;

    const sidebarAuthorRole = document.getElementById('sidebarAuthorRole');
    if (sidebarAuthorRole) sidebarAuthorRole.textContent = authorRoles[data.author] || 'Sustainability Scientist';

    const sidebarReadTime = document.getElementById('sidebarReadTime');
    if (sidebarReadTime) sidebarReadTime.textContent = data.readTime;

    const sidebarCategory = document.getElementById('sidebarCategory');
    if (sidebarCategory) sidebarCategory.textContent = data.tag;

    const recentPostsList = document.getElementById('recentPostsList');
    if (recentPostsList) {
      const otherBlogs = Object.keys(BLOGS_DATA).filter(k => k !== postId);
      recentPostsList.innerHTML = otherBlogs.slice(0, 3).map(k => `
        <a href="blog-detail.html?post=${k}" class="bd-recent-post-link">${BLOGS_DATA[k].title}</a>
      `).join('');
    }

    const galleryGrid = document.getElementById('galleryGrid');
    if (galleryGrid && data.gallery) {
      galleryGrid.innerHTML = data.gallery.map(item => `
        <div class="bd-gallery-card">
          <img src="../${item.image}" alt="${item.caption}" class="bd-gallery-img" loading="lazy" onerror="this.src='../assets/images/blog-hero.png';"/>
          <div class="bd-gallery-overlay">
            <span class="bd-gallery-caption">${item.caption}</span>
          </div>
        </div>
      `).join('');
    }

    const faqAccordion = document.getElementById('faqAccordion');
    if (faqAccordion && data.faqs) {
      faqAccordion.innerHTML = data.faqs.map(faq => `
        <div class="accordion-item">
          <button class="accordion-header">
            ${faq.q}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus"><path d="M12 5v14M5 12h14"/></svg>
          </button>
          <div class="accordion-content">
            <p>${faq.a}</p>
          </div>
        </div>
      `).join('');

      const headers = faqAccordion.querySelectorAll('.accordion-header');
      headers.forEach(header => {
        header.addEventListener('click', () => {
          const item = header.parentElement;
          const content = item.querySelector('.accordion-content');
          const isActive = item.classList.contains('active');

          faqAccordion.querySelectorAll('.accordion-item.active').forEach(activeItem => {
            activeItem.classList.remove('active');
            activeItem.querySelector('.accordion-content').style.maxHeight = null;
          });

          if (!isActive) {
            item.classList.add('active');
            content.style.maxHeight = content.scrollHeight + 'px';
          }
        });
      });
    }

    const relatedGrid = document.getElementById('relatedGrid');
    if (relatedGrid) {
      const otherBlogs = Object.keys(BLOGS_DATA).filter(k => k !== postId);
      const relatedKeys = otherBlogs.slice(0, 3);
      relatedGrid.innerHTML = '';

      relatedKeys.forEach(k => {
        const item = BLOGS_DATA[k];
        const card = document.createElement('article');
        card.className = 'latest-card';
        card.addEventListener('click', () => {
          window.location.href = `blog-detail.html?post=${k}`;
        });

        const excerpts = {
          'plastic-cost': 'Beyond the environmental impact, plastic packaging carries hidden costs that most businesses never calculate. We break down the full financial case.',
          'composting-labels': 'Decoding the certification labels on your packaging so you can make genuinely informed choices between home and industrial composting.',
          'negotiation': 'A practical guide to getting the best bulk pricing — from timing your orders to strategic quotes and supplier alignment.',
          'pbat-vs-pla': 'A deep material science dive into the two dominant compostable polymers — their strength profiles, soil performance, and eco-label certs.',
          'ai-fulfillment': 'How e-commerce brands use dynamic packaging box algorithms to reduce cardboard weights and completely eliminate void-fill wrap.',
          'bcorp-guide': 'A complete blueprint to B Impact Assessments, local environmental sourcing audits, and circular packaging points tracking.',
          'eco-logistics': 'How regionalizing inventory micro-hubs closer to urban areas cuts shipping distance, saves cost, and slashes line-haul freight emissions.'
        };

        const excerpt = excerpts[k] || 'Read our latest insights on sustainable supply chains and eco-friendly packaging advancements.';

        card.innerHTML = `
          <div class="card-img-wrapper">
            <span class="card-category">${item.tag}</span>
            <img src="../${item.image}" alt="${item.title}" class="card-img" loading="lazy" onerror="this.src='../assets/images/blog-hero.png';"/>
          </div>
          <div class="card-body">
            <h3 class="card-title">${item.title}</h3>
            <p class="card-excerpt">${excerpt}</p>
            <div class="card-actions" style="display: flex; justify-content: center; width: 100%; margin-top: auto;">
              <button class="btn-outline-sm" style="width: 100%; max-width: 220px; justify-content: center; display: inline-flex; align-items: center; gap: 8px; border-radius: 20px; min-height: 38px; font-size: 0.85rem; padding: 8px 16px; font-weight: 600;">Read Article <i data-lucide="arrow-right" class="icon-sm" style="width: 14px; height: 14px;"></i></button>
            </div>
          </div>
        `;
        relatedGrid.appendChild(card);
      });
    }
  }

  const bar = document.createElement('div');
  bar.style.cssText = 'position:fixed;top:72px;left:0;height:4px;background:var(--accent);z-index:999;transition:width 0.1s linear;width:0;';
  document.body.appendChild(bar);

  window.addEventListener('scroll', () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    if (total > 0) {
      bar.style.width = Math.min(100, (window.scrollY / total) * 100) + '%';
    }
  });

  const runLucide = () => {
    if (window.lucide) {
      window.lucide.createIcons();
    } else {
      setTimeout(runLucide, 50);
    }
  };
  runLucide();
});
