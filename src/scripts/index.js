import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import markerIcon from 'leaflet/dist/images/marker-icon.png';
import marker2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

import { subscribePush } from './utils/push-notification';
import NotificationHelper from './utils/notification';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: marker2x,
  shadowUrl: markerShadow,
});

// Import halaman
import HomePage from './pages/home/home-page.js';
import AddPage from './pages/add/add-page.js';
import AboutPage from './pages/about/about-page.js';
import LoginPage from './pages/login/login-page.js';
import RegisterPage from './pages/register/register-page.js'; // kalau ada
import { isLoggedIn, removeUserToken } from './utils/auth.js';
import '../styles/main.css';

// Fungsi render dinamis
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
    default:
      renderNotFound();
  }
}

function renderNotFound() {
  const main = document.querySelector('main');
  main.innerHTML = `
    <section class="not-found">
      <h2>404 - Halaman Tidak Ditemukan</h2>
      <p>Ups, halaman ini tidak tersedia.</p>
    </section>
  `;
}

document.addEventListener('DOMContentLoaded', () => {
  const skipLink = document.querySelector('.skip-link');
  skipLink.addEventListener('click', (e) => {
    e.preventDefault();
    const mainContent = document.getElementById('mainContent');
    mainContent.setAttribute('tabindex', '-1');
    mainContent.focus();
  });

  updateAuthButtons();

  const logoutBtn = document.getElementById('logoutBtn');
  logoutBtn.addEventListener('click', (e) => {
    e.preventDefault();
    removeUserToken();
    alert('Berhasil logout!');
    window.location.hash = '/login';
    updateAuthButtons();
  });

  const notifBtn = document.getElementById('notifBtn');
  if (notifBtn) {
    notifBtn.addEventListener('click', subscribePush);
  }
});

function updateAuthButtons() {
  const loginBtn = document.getElementById('loginBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  if (!loginBtn || !logoutBtn) return;

  if (isLoggedIn()) {
    loginBtn.style.display = 'none';
    logoutBtn.style.display = 'inline-block';
  } else {
    loginBtn.style.display = 'inline-block';
    logoutBtn.style.display = 'none';
  }

  const daftarLink = document.getElementById('daftarLink');
  if (isLoggedIn()) {
    if (daftarLink) daftarLink.style.display = 'none';
  } else {
    if (daftarLink) daftarLink.style.display = 'inline';
  }
}

window.updateAuthButtons = updateAuthButtons;
window.addEventListener('hashchange', router);
window.addEventListener('load', router);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(reg => console.log('Service Worker terdaftar:', reg))
      .catch(err => console.error('SW gagal:', err));
  });
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const reg = await navigator.serviceWorker.register('/service-worker.js');
      console.log('SW registered:', reg);

      await NotificationHelper.requestPermission();
      await NotificationHelper.subscribeToPush();
    } catch (err) {
      console.error('SW/Push Notification gagal:', err);
    }
  });

if ('Notification' in window && 'serviceWorker' in navigator) {
  NotificationHelper.requestPermission()
    .then(() => NotificationHelper.subscribeToPush())
    .catch((err) => console.error('SW/Push Notification gagal:', err));
}

}