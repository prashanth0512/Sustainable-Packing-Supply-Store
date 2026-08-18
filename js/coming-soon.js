function handleNotify(e) {
  e.preventDefault();
  const form = document.querySelector('.coming-form');
  const success = document.getElementById('comingSuccess');
  if (form) form.style.display = 'none';
  if (success) success.style.display = 'block';
}
(function countdown() {
  let launch = localStorage.getItem('vp_launch_date');
  if (!launch || new Date(launch) <= new Date()) {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30);
    launch = futureDate.toISOString();
    localStorage.setItem('vp_launch_date', launch);
  }
  const launchDate = new Date(launch);
  function update() {
    let diff = launchDate - new Date();
    if (diff <= 0) {
      const nextLaunch = new Date();
      nextLaunch.setDate(nextLaunch.getDate() + 30);
      localStorage.setItem('vp_launch_date', nextLaunch.toISOString());
      diff = nextLaunch - new Date();
    }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    const pad = n => String(n).padStart(2, '0');
    const elDays = document.getElementById('cDays');
    const elHours = document.getElementById('cHours');
    const elMins = document.getElementById('cMins');
    const elSecs = document.getElementById('cSecs');
    if (elDays) elDays.textContent = pad(d);
    if (elHours) elHours.textContent = pad(h);
    if (elMins) elMins.textContent = pad(m);
    if (elSecs) elSecs.textContent = pad(s);
  }
  update();
  setInterval(update, 1000);
})();
