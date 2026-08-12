document.addEventListener('DOMContentLoaded', () => {
  if (typeof BLOGS_DATA === 'undefined') {
    console.error('BLOGS_DATA is not defined. Make sure navigation-data.js is loaded.');
    return;
  }

  const featuredGrid = document.getElementById('featuredGrid');
  const blogGrid = document.getElementById('blogGrid');
  const searchInput = document.getElementById('blogSearch');
  const filterTabs = document.querySelectorAll('.filter-tab');

  const authorAvatars = {
    'Marcus Okafor': '../assets/images/avatar-marcus.png',
    'Sarah Jenkins': '../assets/images/avatar-sarah.png',
    'David Chen': '../assets/images/avatar-jamie.png',
    'Dr. Elena Rossi': '../assets/images/avatar-sarah.png',
    'Sofia Nakamura': '../assets/images/avatar-anika.png',
    'Jamie Rivera': '../assets/images/avatar-jamie.png'
  };

  const blogExcerpts = {
    'plastic-cost': 'Beyond the environmental impact, plastic packaging carries hidden costs that most businesses never calculate. We break down the full financial case.',
    'composting-labels': 'Decoding the certification labels on your packaging so you can make genuinely informed choices between home and industrial composting.',
    'negotiation': 'A practical guide to getting the best bulk pricing — from timing your orders to strategic quotes and supplier alignment.',
    'pbat-vs-pla': 'A deep material science dive into the two dominant compostable polymers — their strength profiles, soil performance, and eco-label certs.',
    'ai-fulfillment': 'How e-commerce brands use dynamic packaging box algorithms to reduce cardboard weights and completely eliminate void-fill wrap.',
    'bcorp-guide': 'A complete blueprint to B Impact Assessments, local environmental sourcing audits, and circular packaging points tracking.',
    'eco-logistics': 'How regionalizing inventory micro-hubs closer to urban areas cuts shipping distance, saves cost, and slashes line-haul freight emissions.'
  };

  const blogsArray = Object.keys(BLOGS_DATA).map(key => ({
    id: key,
    ...BLOGS_DATA[key],
    excerpt: blogExcerpts[key] || 'Read our latest insights on sustainable supply chains and eco-friendly packaging advancements.'
  }));

  function renderAll() {
    renderFeatured();
    renderLatest();
  }

  function renderFeatured() {
    if (!featuredGrid) return;
    featuredGrid.innerHTML = '';

    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const activeFilter = getActiveFilter();

    const filtered = blogsArray.filter(blog => {
      const matchesSearch = !query || 
                            blog.title.toLowerCase().includes(query) ||
                            blog.tag.toLowerCase().includes(query) ||
                            blog.author.toLowerCase().includes(query) ||
                            blog.excerpt.toLowerCase().includes(query);
      const matchesFilter = activeFilter === 'all' || 
                            blog.tag.toLowerCase().includes(activeFilter.toLowerCase()) || 
                            (activeFilter === 'packaging' && blog.tag.toLowerCase().includes('tech'));
      return matchesSearch && matchesFilter;
    });

    if (filtered.length === 0) {
      featuredGrid.innerHTML = `<div class="no-results" style="grid-column: 1/-1; text-align: center; padding: 60px 40px; color: var(--text-muted); font-weight: 500; width: 100%;">No featured publications match your search criteria.</div>`;
      return;
    }

    const featuredItems = filtered.slice(0, 3);
    featuredItems.forEach(blog => {
      const card = createCardMarkup(blog, 'featured-card');
      featuredGrid.appendChild(card);
    });
  }

  function renderLatest() {
    if (!blogGrid) return;
    blogGrid.innerHTML = '';

    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const activeFilter = getActiveFilter();

    const filtered = blogsArray.filter(blog => {
      const matchesSearch = !query || 
                            blog.title.toLowerCase().includes(query) ||
                            blog.tag.toLowerCase().includes(query) ||
                            blog.author.toLowerCase().includes(query) ||
                            blog.excerpt.toLowerCase().includes(query);
      const matchesFilter = activeFilter === 'all' || 
                            blog.tag.toLowerCase().includes(activeFilter.toLowerCase()) || 
                            (activeFilter === 'packaging' && blog.tag.toLowerCase().includes('tech'));
      return matchesSearch && matchesFilter;
    });

    if (filtered.length === 0) {
      blogGrid.innerHTML = `<div class="no-results" style="grid-column: 1/-1; text-align: center; padding: 60px 40px; color: var(--text-muted); font-weight: 500; width: 100%;">No articles found matching the current keyword. Try a different search.</div>`;
      return;
    }

    const latestItems = filtered.slice(0, 6);
    latestItems.forEach(blog => {
      const card = createCardMarkup(blog, 'latest-card');
      blogGrid.appendChild(card);
    });
  }

  function getActiveFilter() {
    const activeTab = document.querySelector('.filter-tab.active');
    return activeTab ? activeTab.dataset.filter : 'all';
  }

  function createCardMarkup(blog, cardClass) {
    const card = document.createElement('article');
    card.className = cardClass;
    card.setAttribute('data-post', blog.id);

    const avatar = authorAvatars[blog.author] || '../assets/images/avatar-marcus.png';

    card.addEventListener('click', () => {
      window.location.href = `blog-detail.html?post=${blog.id}`;
    });

    card.innerHTML = `
      <div class="card-img-wrapper">
        <span class="card-category">${blog.tag}</span>
        <img src="../${blog.image}" alt="${blog.title}" class="card-img" loading="lazy" onerror="this.src='../assets/images/blog-hero.png';"/>
      </div>
      <div class="card-body">
        <h3 class="card-title">${blog.title}</h3>
        <p class="card-excerpt">${blog.excerpt}</p>

        <div class="author-profile">
          <img src="${avatar}" alt="${blog.author}" class="author-avatar" onerror="this.src='../assets/images/avatar-marcus.png';"/>
          <div class="author-details">
            <span class="author-name">${blog.author}</span>
            <div class="post-meta-info">
              <span>${blog.date}</span>
              <span class="meta-divider"></span>
              <span>${blog.readTime}</span>
            </div>
          </div>
        </div>

        <div class="card-actions">
          <button class="btn-outline-sm">Read Article <i data-lucide="arrow-right" class="icon-sm" style="width: 14px; height: 14px;"></i></button>
        </div>
      </div>
    `;

    return card;
  }

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      renderAll();
      if (window.lucide) {
        window.lucide.createIcons();
      }
    });
  }

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderAll();
      if (window.lucide) {
        window.lucide.createIcons();
      }
    });
  });

  renderAll();

  setTimeout(() => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, 100);
});
