export function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  
  // Directly create Uint8Array from rawData
  const uint8Array = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i++) {
    uint8Array[i] = rawData.charCodeAt(i);
  }
  return uint8Array;
}
