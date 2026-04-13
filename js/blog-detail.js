document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const postId = params.get('post') || 'plastic-cost';
  const isSubfolder = window.location.pathname.includes('/html/');
  const data = BLOGS_DATA[postId] || BLOGS_DATA['plastic-cost'];

  if (data) {
    const prefix = isSubfolder ? '../' : '';
    document.title = `${data.title} — VerdantPack`;
    const titleEl = document.querySelector('.article-header h1');
    if (titleEl) titleEl.textContent = data.title;

    const tagEl = document.querySelector('.post-tag');
    if (tagEl) tagEl.textContent = data.tag;

    const authorEl = document.querySelector('.author-info strong');
    if (authorEl) authorEl.textContent = data.author;

    const dateEl = document.querySelector('.author-info span');
    if (dateEl) dateEl.textContent = `Head of Sustainability · ${data.date}`;

    const readTimeEl = document.querySelector('.article-stats span:first-child');
    if (readTimeEl) readTimeEl.textContent = data.readTime;

    const heroImg = document.querySelector('.article-hero-img img');
    if (heroImg) {
      heroImg.src = prefix + data.image;
      heroImg.alt = data.title;
    }

    const contentEl = document.querySelector('.article-content');
    if (contentEl) {
      let content = data.content || '<p>Content loading error.</p>';
      if (isSubfolder) {
        content = content.replace(/src="assets\//g, 'src="../assets/');
      }
      contentEl.innerHTML = content;
    }
  }

  const bar = document.createElement('div');
  bar.style.cssText = 'position:fixed;top:72px;left:0;height:3px;background:var(--accent);z-index:999;transition:width 0.1s linear;width:0;';
  document.body.appendChild(bar);
  window.addEventListener('scroll', () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = Math.min(100, (window.scrollY / total) * 100) + '%';
  });
});