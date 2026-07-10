// Client-side authentication & Route Protection for Learts Admin Dashboard

(function() {
  const token = localStorage.getItem('adminToken');
  const path = window.location.pathname;

  const isAuthPage = path.includes('/admin/login') || path.includes('/admin/register');

  if (!token && !isAuthPage) {
    // Not logged in, trying to access protected dashboard -> redirect to login
    window.location.href = '/admin/login';
  } else if (token && isAuthPage) {
    // Logged in, trying to access login/register -> redirect to dashboard
    window.location.href = '/admin/products';
  }
})();

// Global logout function
function logout() {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminUser');
  showToast('Logged out successfully', 'success');
  setTimeout(() => {
    window.location.href = '/admin/login';
  }, 1000);
}

// Fetch helper to get Authorization headers
function getHeaders() {
  const token = localStorage.getItem('adminToken');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  };
}

// Toast notification helper
function showToast(message, type = 'success') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <div class="toast-message">${message}</div>
  `;
  container.appendChild(toast);

  // Auto remove toast after 3 seconds
  setTimeout(() => {
    toast.style.animation = 'fadeOut 0.3s ease forwards';
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3000);
}

// Set up UI elements for logged-in admin (name, avatar, logout handlers)
document.addEventListener('DOMContentLoaded', () => {
  const adminUserStr = localStorage.getItem('adminUser');
  if (adminUserStr) {
    try {
      const user = JSON.parse(adminUserStr);
      const nameEl = document.getElementById('admin-name');
      const avatarEl = document.getElementById('admin-avatar');
      
      if (nameEl) nameEl.textContent = user.username || 'Admin';
      if (avatarEl && user.username) {
        avatarEl.textContent = user.username.substring(0, 2).toUpperCase();
      }
    } catch (e) {
      console.error('Error parsing admin user details', e);
    }
  }

  // Hook logout button
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      logout();
    });
  }
});
