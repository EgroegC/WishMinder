import { urlBase64ToUint8Array } from './utils';
import type { AxiosInstance } from 'axios';

export async function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.register('/service-worker.js');
    return registration;
  } else {
    throw new Error('Service Workers are not supported in this browser.');
  }
}

export async function subscribeUser(registration: ServiceWorkerRegistration, axiosPrivate: AxiosInstance) {
  const publicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicKey),
  });

  axiosPrivate.post("/api/subscribe", JSON.stringify(subscription));

  return subscription;
}
