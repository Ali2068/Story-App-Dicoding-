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