if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker
      .register('/sw.js', { scope: '/' })
      .then(function (registration) {
        registration.update();
        console.log('PWA ServiceWorker active with scope:', registration.scope);
      })
      .catch(function (error) {
        console.warn('PWA ServiceWorker registration failed:', error);
      });
  });
}
