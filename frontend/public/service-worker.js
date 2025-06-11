self.addEventListener('push', event => {
  const data = event.data?.json();

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      data: {
        url: data.data.url 
      }
    })
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();

  const targetUrl = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      for (const client of clientList) {
        if (client.url === targetUrl && 'focus' in client) {
          return client.focus();
        }
      }
      return clients.openWindow(targetUrl);
    })
  );
});
