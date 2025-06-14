import '../styles/main.css';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import HomePage from './pages/home/home-page.js';
import AddPage from './pages/add/add-page.js';
import AboutPage from './pages/about/about-page.js';
import LoginPage from './pages/login/login-page.js';
import RegisterPage from './pages/register/register-page.js';
import FavoritePage from './pages/favorite/favorite-page.js';

import { isLoggedIn, removeUserToken } from './utils/auth.js';
import NotificationHelper from './utils/notification.js';

import markerIcon from 'leaflet/dist/images/marker-icon.png';
import marker2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: marker2x,
  shadowUrl: markerShadow,
});

// 🔁 Routing function
async function renderPage(pageModule) {
  const main = document.querySelector('main');
  if (document.startViewTransition) {
    document.startViewTransition(async () => {
      main.innerHTML = await pageModule.render();
      await pageModule.afterRender?.();
    });
  } else {
    main.innerHTML = await pageModule.render();
    await pageModule.afterRender?.();
  }
}

// 📍 Router
function router() {
  const path = window.location.hash.slice(1).toLowerCase() || '/';

  switch (path) {
    case '':
    case '/':
    case 'home':
      if (!isLoggedIn()) {
        window.location.hash = '/login';
        return;
      }
      renderPage(HomePage);
      break;
    case 'add':
      if (!isLoggedIn()) {
        alert('Silakan login terlebih dahulu');
        window.location.hash = '/login';
        return;
      }
      renderPage(AddPage);
      break;
    case 'about':
      renderPage(AboutPage);
      break;
    case 'login':
      renderPage(LoginPage);
      break;
    case 'register':
      renderPage(RegisterPage);
      break;
    case 'favorite':
      renderPage(FavoritePage);
      break;
    default:
      renderNotFound();
  }
}

// 📄 Not Found
function renderNotFound() {
  const main = document.querySelector('main');
  main.innerHTML = `
    <section class="not-found">
      <h2>404 - Halaman Tidak Ditemukan</h2>
      <p>Ups, halaman ini tidak tersedia.</p>
    </section>
  `;
}

// 🧠 Auth & Navigasi
function updateAuthButtons() {
  const loginBtn = document.getElementById('loginBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  const daftarLink = document.getElementById('daftarLink');
  const favLink = document.getElementById('favLink');

  if (isLoggedIn()) {
    loginBtn?.style.setProperty('display', 'none');
    logoutBtn?.style.setProperty('display', 'inline-block');
    daftarLink?.style.setProperty('display', 'none');
    favLink?.style.setProperty('display', 'inline');
  } else {
    loginBtn?.style.setProperty('display', 'inline-block');
    logoutBtn?.style.setProperty('display', 'none');
    daftarLink?.style.setProperty('display', 'inline');
    favLink?.style.setProperty('display', 'none');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Skip to content
  const skipLink = document.querySelector('.skip-link');
  skipLink?.addEventListener('click', (e) => {
    e.preventDefault();
    const mainContent = document.getElementById('mainContent');
    mainContent?.setAttribute('tabindex', '-1');
    mainContent?.focus();
  });

  // Logout
  const logoutBtn = document.getElementById('logoutBtn');
  logoutBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    removeUserToken();
    alert('Berhasil logout!');
    window.location.hash = '/login';
    updateAuthButtons();
    updateNotifButtons(); // Update tombol notif juga
  });

  // Push Notification
  const notifBtn = document.getElementById('notifBtn');
  const unsubBtn = document.getElementById('unsubscribeBtn');
  const notifStatus = document.getElementById('notifStatus');

  if (notifBtn) {
    notifBtn.addEventListener('click', async () => {
      if (!isLoggedIn()) {
        alert('Harap login terlebih dahulu untuk mengaktifkan notifikasi');
        return;
      }

      try {
        await NotificationHelper.requestPermission();
        await NotificationHelper.subscribeToPush();
        alert('Notifikasi berhasil diaktifkan!');
      } catch (err) {
        console.error('❌ Gagal mengaktifkan notifikasi:', err.message);
        alert('Gagal mengaktifkan notifikasi!');
      }

      await updateNotifButtons();
    });
  }

  if (unsubBtn) {
    unsubBtn.addEventListener('click', async () => {
      try {
        await NotificationHelper.unsubscribeFromPush();
        alert('Notifikasi berhasil dimatikan!');
      } catch (err) {
        console.error('❌ Gagal mematikan notifikasi:', err.message);
        alert('Gagal mematikan notifikasi.');
      }

      await updateNotifButtons();
    });
  }

  async function updateNotifButtons() {
    const isSubbed = await NotificationHelper.isSubscribed();
    const isAuth = isLoggedIn();

    if (!isAuth) {
      notifBtn.style.display = 'inline-block';
      notifBtn.disabled = true;
      unsubBtn.style.display = 'none';
      notifStatus.textContent = 'Silakan login untuk mengelola notifikasi';
      return;
    }

    notifBtn.disabled = false;

    if (isSubbed) {
      notifBtn.style.display = 'none';
      unsubBtn.style.display = 'inline-block';
      notifStatus.textContent = '🔔 Notifikasi aktif';
    } else {
      notifBtn.style.display = 'inline-block';
      unsubBtn.style.display = 'none';
      notifStatus.textContent = '🔕 Notifikasi nonaktif';
    }
  }

  updateNotifButtons();
  
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('/sw.bundle.js')
      .then(() => console.log('✅ Service Worker registered successfully'))
      .catch((err) =>
        console.error('❌ Service Worker registration failed:', err)
      );
  }
});

// 🧭 Event Routing
window.updateAuthButtons = updateAuthButtons;
window.addEventListener('hashchange', router);
window.addEventListener('load', router);