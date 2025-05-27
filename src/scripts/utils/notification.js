const PUBLIC_VAPID_KEY = 'BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk';
import { getUserToken } from './auth';

const NotificationHelper = {
  async requestPermission() {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') throw new Error('Izin notifikasi ditolak');
  },
  
  async isSubscribed() {
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.getSubscription();
    return !!sub;
  },

  async subscribeToPush() {
    const reg = await navigator.serviceWorker.ready;

    const sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY),
    });

    // Kirim ke server
    const token = getUserToken();
    await fetch('https://story-api.dicoding.dev/v1/notifications/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ subscription: sub }),
    });

    console.log('✅ Subscription aktif & dikirim ke server');
  },

  async unsubscribeFromPush() {
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.getSubscription();
    if (!sub) {
      alert('Tidak ada langganan notifikasi aktif.');
      return;
    }

    // Hapus dari browser
    const success = await sub.unsubscribe();
    if (!success) throw new Error('Gagal unsubscribe di browser.');

    // Hapus dari server
    const token = getUserToken();
    const res = await fetch('https://story-api.dicoding.dev/v1/notifications/subscribe', {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Gagal unsubscribe dari server.');
    }

    console.log('🗑️ Subscription dihapus dari browser dan server.');
  }
};

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = window.atob(base64);
  return Uint8Array.from([...raw].map(char => char.charCodeAt(0)));
}

export default NotificationHelper;