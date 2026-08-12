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

      if (tabId === 'overview' || tabId === 'analytics' || tabId === 'impact') {
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
      btn.innerHTML = '<i data-lucide="check-circle" class="icon-sm"></i> Triggered';
      btn.classList.add('success-state');
      if (window.lucide) window.lucide.createIcons();
      setTimeout(() => {
        btn.textContent = 'Quick Order';
        btn.classList.remove('success-state');
      }, 2000);
    });
  });

  const calcProduct = document.getElementById('calcProductSelect');
  const calcQtyInput = document.getElementById('calcQuantityInput');
  const calcQtySlider = document.getElementById('calcQuantitySlider');
  const calcCost = document.getElementById('calcEstimatedCost');
  const calcTag = document.getElementById('calcDiscountTag');

  function updateCalculator() {
    if (!calcProduct || !calcQtyInput || !calcCost) return;
    const qty = parseInt(calcQtyInput.value) || 0;
    const unitPrice = parseFloat(calcProduct.options[calcProduct.selectedIndex].getAttribute('data-price')) || 0;

    let discount = 0;
    if (qty >= 25000) {
      discount = 0.40;
    } else if (qty >= 5000) {
      discount = 0.20;
    } else if (qty >= 1000) {
      discount = 0.10;
    } else if (qty >= 500) {
      discount = 0.05;
    }

    const total = qty * unitPrice * (1 - discount);
    calcCost.textContent = '$' + total.toFixed(2);
    if (calcTag) {
      if (discount > 0) {
        calcTag.textContent = `Volume discount: ${(discount * 100)}% Off applied`;
        calcTag.style.color = 'var(--accent)';
      } else {
        calcTag.textContent = 'Standard rate (No discount applied below 500 units)';
        calcTag.style.color = 'var(--text-muted)';
      }
    }
  }

  calcQtyInput?.addEventListener('input', () => {
    if (calcQtySlider) calcQtySlider.value = calcQtyInput.value;
    updateCalculator();
  });

  calcQtySlider?.addEventListener('input', () => {
    if (calcQtyInput) calcQtyInput.value = calcQtySlider.value;
    updateCalculator();
  });

  calcProduct?.addEventListener('change', updateCalculator);
  updateCalculator();

  const ordersSearch = document.getElementById('ordersSearchInput');
  const ordersStatus = document.getElementById('ordersStatusFilter');
  const ordersSort = document.getElementById('ordersSortOrder');
  const ordersTableBody = document.querySelector('#ordersTable tbody');

  function filterOrdersTable() {
    if (!ordersTableBody) return;
    const searchVal = ordersSearch?.value.toLowerCase() || '';
    const statusVal = ordersStatus?.value || 'all';
    const rows = Array.from(ordersTableBody.querySelectorAll('tr'));

    rows.forEach(row => {
      const text = row.textContent.toLowerCase();
      const status = row.getAttribute('data-status') || '';

      const matchSearch = text.includes(searchVal);
      const matchStatus = statusVal === 'all' || status === statusVal;

      if (matchSearch && matchStatus) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });

    const sortVal = ordersSort?.value;
    if (sortVal) {
      const sortedRows = rows.sort((a, b) => {
        const idA = a.querySelector('.order-id')?.textContent || '';
        const idB = b.querySelector('.order-id')?.textContent || '';
        return sortVal === 'newest' ? idB.localeCompare(idA) : idA.localeCompare(idB);
      });
      sortedRows.forEach(row => ordersTableBody.appendChild(row));
    }
  }

  ordersSearch?.addEventListener('input', filterOrdersTable);
  ordersStatus?.addEventListener('change', filterOrdersTable);
  ordersSort?.addEventListener('change', filterOrdersTable);

  initCharts();

  setTimeout(() => {
    document.querySelectorAll('.progress-fill').forEach(bar => {
      const w = bar.style.width;
      bar.style.width = '0';
      setTimeout(() => { bar.style.width = w; }, 100);
    });
  }, 400);

  const runLucide = () => {
    if (window.lucide) {
      window.lucide.createIcons();
    } else {
      setTimeout(runLucide, 50);
    }
  };
  runLucide();
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
          borderColor: '#C49A6C',
          backgroundColor: 'rgba(196, 154, 108, 0.15)',
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

  const revenueCanvas = document.getElementById('revenueChart');
  if (revenueCanvas) {
    charts.revenue = new Chart(revenueCanvas.getContext('2d'), {
      type: 'line',
      data: {
        labels: ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'],
        datasets: [{
          label: 'Revenue ($)',
          data: [5000, 7200, 6800, 9400, 8900, 14280],
          borderColor: '#8B5E3C',
          backgroundColor: 'rgba(139, 94, 60, 0.15)',
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

  const analyticsRevenueCanvas = document.getElementById('analyticsRevenueChart');
  if (analyticsRevenueCanvas) {
    charts.analyticsRevenue = new Chart(analyticsRevenueCanvas.getContext('2d'), {
      type: 'bar',
      data: {
        labels: ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'],
        datasets: [
          {
            label: 'Mailers',
            data: [2200, 3100, 2900, 4000, 3800, 6000],
            backgroundColor: '#C49A6C',
            borderRadius: 6
          },
          {
            label: 'Boxes',
            data: [1800, 2500, 2300, 3200, 2900, 5100],
            backgroundColor: '#8B5E3C',
            borderRadius: 6
          },
          {
            label: 'Tape & Misc',
            data: [1000, 1600, 1600, 2200, 2200, 3180],
            backgroundColor: '#D4B088',
            borderRadius: 6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: { color: textColor, boxWidth: 12, padding: 16, font: { size: 11 } }
          }
        },
        scales: {
          x: { stacked: false, grid: { display: false }, ticks: { color: textColor } },
          y: {
            stacked: false,
            grid: { color: borderColor },
            ticks: { color: textColor, callback: v => '$' + v.toLocaleString() }
          }
        }
      }
    });
  }

  const profitCanvas = document.getElementById('profitChart');
  if (profitCanvas) {
    charts.profit = new Chart(profitCanvas.getContext('2d'), {
      type: 'line',
      data: {
        labels: ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'],
        datasets: [{
          label: 'Profit',
          data: [1500, 2400, 2200, 3100, 2900, 4890],
          borderColor: '#C49A6C',
          backgroundColor: 'rgba(196, 154, 108, 0.1)',
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
          backgroundColor: ['#C49A6C', '#8B5E3C', '#D4B088', '#F4ECE2'],
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
          backgroundColor: '#C49A6C',
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

  const overviewBarCanvas = document.getElementById('overviewBarChart');
  if (overviewBarCanvas) {
    charts.overviewBar = new Chart(overviewBarCanvas.getContext('2d'), {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'Impact (kg CO2)',
          data: [120, 150, 180, 210, 250, 300],
          backgroundColor: '#C49A6C',
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
