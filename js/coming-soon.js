function handleNotify(e) {
  e.preventDefault();
  document.querySelector('.coming-form').style.display = 'none';
  document.getElementById('comingSuccess').style.display = 'block';
}

(function countdown() {
  const launch = new Date('2026-04-01T00:00:00');
  function update() {
    const diff = launch - new Date();
    if (diff <= 0) return;
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    const pad = n => String(n).padStart(2, '0');
    document.getElementById('cDays').textContent = pad(d);
    document.getElementById('cHours').textContent = pad(h);
    document.getElementById('cMins').textContent = pad(m);
    document.getElementById('cSecs').textContent = pad(s);
  }
  update();
  setInterval(update, 1000);
})();