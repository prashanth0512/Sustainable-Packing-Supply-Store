window.addEventListener('theme-changed', (e) => {
  initCharts();
});

let charts = {};

document.addEventListener('DOMContentLoaded', () => {
  const sidebar = document.getElementById('dashSidebar');
  const main = document.querySelector('.dash-main');
  const toggleBtn = document.getElementById('sidebarToggle');
  const closeSidebar = () => {
    if (window.innerWidth <= 1024) {
      sidebar?.classList.remove('open');
      main?.classList.remove('sidebar-open');
    } else {
      sidebar?.classList.add('closedDesktop');
      main?.classList.add('sidebar-closedDesktop');
    }
  };

  const openSidebar = () => {
    if (window.innerWidth <= 1024) {
      sidebar?.classList.add('open');
      main?.classList.add('sidebar-open');
    } else {
      sidebar?.classList.remove('closedDesktop');
      main?.classList.remove('sidebar-closedDesktop');
    }
  };

  const toggleSidebar = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.innerWidth <= 1024) {
      sidebar?.classList.toggle('open');
      main?.classList.toggle('sidebar-open');
    } else {
      sidebar?.classList.toggle('closedDesktop');
      main?.classList.toggle('sidebar-closedDesktop');
    }
  };

  if (toggleBtn) {
    toggleBtn.addEventListener('click', toggleSidebar);
  }
  document.addEventListener('click', (e) => {
    if (window.innerWidth <= 1024 && sidebar?.classList.contains('open')) {
      if (!sidebar.contains(e.target) && !toggleBtn?.contains(e.target)) {
        closeSidebar();
      }
    }
  });

  const navItems = document.querySelectorAll('.dash-nav-item');
  const tabPanes = document.querySelectorAll('.tab-pane');

  function switchTab(tabId) {
    if (!tabId || tabId === 'back') return;

    navItems.forEach(i => {
      i.classList.remove('active');
      if (i.getAttribute('data-tab') === tabId) i.classList.add('active');
    });

    tabPanes.forEach(p => {
      p.classList.remove('active');
      p.style.display = 'none'; 
    });
    
    const activePane = document.getElementById('tab-' + tabId);
    if (activePane) {
      activePane.classList.add('active');
      activePane.style.display = 'block'; 
      
      if (tabId === 'overview' || tabId === 'analytics') {
        setTimeout(initCharts, 50);
      }
    }

    if (window.innerWidth <= 1024) {
      closeSidebar();
    }
  }

  navItems.forEach(item => {
    item.addEventListener('click', e => {
      const tabId = item.getAttribute('data-tab');
      if (tabId) {
        e.preventDefault();
        switchTab(tabId);
      }
    });
  });

  document.getElementById('profileBtn')?.addEventListener('click', () => {
    switchTab('settings');
  });

  document.getElementById('notifBtn')?.addEventListener('click', () => {
    switchTab('notifications');
  });

  document.querySelectorAll('.reorder-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.textContent = '✅ Added';
      btn.classList.add('success-state');
      setTimeout(() => {
        btn.textContent = 'Reorder';
        btn.classList.remove('success-state');
      }, 2000);
    });
  });

  initCharts();

  setTimeout(() => {
    document.querySelectorAll('.progress-fill').forEach(bar => {
      const w = bar.style.width;
      bar.style.width = '0';
      setTimeout(() => { bar.style.width = w; }, 100);
    });
  }, 400);
});

function initCharts() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const textColor = isDark ? '#7a9a72' : '#6b7f65';
  const borderColor = isDark ? '#2d4028' : '#d8e4cf';

  Object.values(charts).forEach(chart => chart.destroy());
  charts = {};

  const lineCanvas = document.getElementById('lineChart');
  if (lineCanvas) {
    charts.line = new Chart(lineCanvas.getContext('2d'), {
      type: 'line',
      data: {
        labels: ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'],
        datasets: [{
          label: 'Orders',
          data: [3200, 4100, 3800, 5200, 4900, 6820],
          borderColor: '#3d8b37',
          backgroundColor: 'rgba(61, 139, 55, 0.1)',
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false }, ticks: { color: textColor } },
          y: { grid: { color: borderColor }, ticks: { color: textColor } }
        }
      }
    });
  }

  const pieCanvas = document.getElementById('pieChart');
  if (pieCanvas) {
    charts.pie = new Chart(pieCanvas.getContext('2d'), {
      type: 'doughnut',
      data: {
        labels: ['Bags', 'Boxes', 'Mailers', 'Tape'],
        datasets: [{
          data: [45, 25, 20, 10],
          backgroundColor: ['#3d8b37', '#7ab648', '#a5d6a7', '#e8f5e3'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: { color: textColor }
          }
        },
        cutout: '70%'
      }
    });
  }

  const barCanvas = document.getElementById('barChart');
  if (barCanvas) {
    charts.bar = new Chart(barCanvas.getContext('2d'), {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'Impact (kg CO2)',
          data: [120, 150, 180, 210, 250, 300],
          backgroundColor: '#3d8b37',
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false }, ticks: { color: textColor } },
          y: { grid: { color: borderColor }, ticks: { color: textColor } }
        }
      }
    });
  }
}