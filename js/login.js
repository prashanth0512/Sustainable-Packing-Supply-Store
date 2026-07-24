document.addEventListener('DOMContentLoaded', () => {
  function setupPassToggle(btnId, inputId) {
    const btn = document.getElementById(btnId);
    const input = document.getElementById(inputId);
    if (btn && input) {
      btn.addEventListener('click', () => {
        const isPass = input.type === 'password';
        input.type = isPass ? 'text' : 'password';
        btn.innerHTML = isPass ? 
          '<i data-lucide="eye-off" class="icon-sm"></i>' : 
          '<i data-lucide="eye" class="icon-sm"></i>';
        if (window.lucide) window.lucide.createIcons();
      });
    }
  }

  setupPassToggle('togglePass', 'password');
  setupPassToggle('toggleSignupPass', 'password');

  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleAuthSuccess();
    });
  }

  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const pass = document.getElementById('password').value;
      const confirm = document.getElementById('confirmPassword').value;

      if (pass !== confirm) {
        alert('Passwords do not match');
        return;
      }
      handleAuthSuccess();
    });
  }

  function handleAuthSuccess() {
    document.body.style.opacity = '0';
    setTimeout(() => {
      window.location.href = window.location.pathname.includes('/html/') ? 'dashboard.html' : 'html/dashboard.html';
    }, 300);
  }

  const runLucide = () => {
    if (window.lucide) {
      window.lucide.createIcons();
    } else {
      setTimeout(runLucide, 50);
    }
  };
  runLucide();
});