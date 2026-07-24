document.addEventListener('DOMContentLoaded', () => {
  const runLucide = () => {
    if (window.lucide) {
      window.lucide.createIcons();
    } else {
      setTimeout(runLucide, 50);
    }
  };
  runLucide();
});