document.addEventListener('DOMContentLoaded', () => {
  const preview = document.querySelector('.dashboard-preview');
  if (preview) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          preview.style.opacity = '1';
          observer.unobserve(preview);
        }
      });
    });
    observer.observe(preview);
  }
});

