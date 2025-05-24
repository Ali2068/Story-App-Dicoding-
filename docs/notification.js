const PUBLIC_VAPID_KEY = 'BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk';
import { getUserToken } from '../utils/auth';

async function sendSubscriptionToServer(subscription) {
  const token = getUserToken();
  const response = await fetch('https://story-api.dicoding.dev/v1/push/web', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ subscription }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || 'Gagal mengirim subscription');
  }
}

const NotificationHelper = {
  async subscribeToPush() {
    // ✅ Pastikan izin diberikan terlebih dahulu
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.warn('❌ Izin notifikasi ditolak');
      throw new Error('Izin notifikasi belum diberikan');
    }

    const reg = await navigator.serviceWorker.ready;

    const sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY),
    });

    console.log('✅ Subscription diperoleh:', sub);
    await sendSubscriptionToServer(sub);
    console.log('✅ Subscription berhasil dikirim ke server');
  },
};

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = window.atob(base64);
  return Uint8Array.from([...raw].map((char) => char.charCodeAt(0)));
}

export default NotificationHelper;