import { getUserToken } from '../utils/auth';

const PUBLIC_VAPID_KEY = 'BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk';
const SUBSCRIBE_API_URL = 'https://story-api.dicoding.dev/v1/notifications/subscribe';

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = window.atob(base64);
  return Uint8Array.from([...raw].map(char => char.charCodeAt(0)));
}

async function sendSubscriptionToServer(subscription) {
  const token = getUserToken();
  const cleanSub = {
    endpoint: subscription.endpoint,
    keys: subscription.toJSON().keys,
  };

  const res = await fetch(SUBSCRIBE_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(cleanSub),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Gagal mengirim subscription ke server');
  }
}

async function deleteSubscriptionFromServer(endpoint) {
  const token = getUserToken();
  const res = await fetch(SUBSCRIBE_API_URL, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ endpoint }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Gagal menghapus subscription dari server');
  }
}

const NotificationHelper = {
  async requestPermission() {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      throw new Error('Izin notifikasi ditolak oleh pengguna');
    }
  },

  async subscribeToPush() {
    const reg = await navigator.serviceWorker.ready;

    const sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY),
    });

    console.log('✅ Subscription berhasil dibuat:', sub);

    // Hanya kirim properti yang diizinkan oleh API
    await sendSubscriptionToServer(sub);
    console.log('✅ Subscription dikirim ke server');
  },

  async unsubscribeFromPush() {
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.getSubscription();

    if (!sub) {
      throw new Error('Belum ada subscription aktif');
    }

    const { endpoint } = sub;
    await deleteSubscriptionFromServer(endpoint);

    const result = await sub.unsubscribe();
    if (!result) {
      throw new Error('Gagal melakukan unsubscribe di PushManager');
    }

    console.log('🔕 Subscription berhasil dihentikan & dihapus dari server');
  },

  async isSubscribed() {
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.getSubscription();
    return !!sub;
  }
};

export default NotificationHelper;