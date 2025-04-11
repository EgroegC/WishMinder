self.addEventListener('push', (event) => {
  console.log('Got in the event Listener');
  self.registration.showNotification( "Heyyyy", {body: event.data.text() });
});