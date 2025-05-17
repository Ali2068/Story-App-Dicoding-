import { urlBase64ToUint8Array } from './vapid-converter';

export const subscribePush = async () => {
  if (!('serviceWorker' in navigator)) return alert('Service Worker tidak didukung browser Anda.');

  const registration = await navigator.serviceWorker.ready;
  const publicKey = await getVapidPublicKey();
  const convertedKey = urlBase64ToUint8Array(publicKey);

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: convertedKey,
  });

  console.log('Push Subscription:', subscription);
  alert('Notifikasi berhasil diaktifkan!');
};

const getVapidPublicKey = async () => {
  const res = await fetch('https://story-api.dicoding.dev/v1/push/web');
  const data = await res.json();
  return data.vapidPublicKey;
};