/* Val d'Aran en calma — service worker ligero para uso sin conexión.
 * Si cambias la lista SHELL, sube la versión CACHE para forzar la actualización.
 * Los mapas de Google y otros contenidos de terceros no se cachean.
 * Open-Meteo sí puede conservar la última previsión correcta para consulta offline. */
const CACHE = "aran-v15";
const SHELL = [
  "./",
  "./index.html",
  "./css/styles.css",
  "./js/app.js",
  "./manifest.webmanifest",
  "./assets/icon.svg",
  "./assets/icon-192.png",
  "./assets/icon-512.png",
  "./assets/apple-touch-icon.png",
  "./assets/illustrations/valley.jpg",
  "./assets/illustrations/dusk.jpg",
  "./assets/fonts/fraunces.woff2",
  "./assets/fonts/atkinson-regular.woff2",
  "./assets/fonts/atkinson-bold.woff2",
  "./assets/fonts/atkinson-italic.woff2",
];

self.addEventListener("install", (ev) => {
  ev.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (ev) => {
  ev.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (ev) => {
  const req = ev.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // Tiempo: conservar la última respuesta correcta para poder consultar la previsión sin cobertura.
  if (url.origin === "https://api.open-meteo.com") {
    ev.respondWith(
      caches.open(CACHE).then((cache) =>
        fetch(req)
          .then((res) => {
            if (res.ok) cache.put(req, res.clone());
            return res;
          })
          .catch(() => cache.match(req))
      )
    );
    return;
  }

  if (url.origin !== self.location.origin) return;

  // Navegación: red primero (guía viva), caché si no hay conexión.
  if (req.mode === "navigate") {
    ev.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req).then((r) => r || caches.match("./index.html")))
    );
    return;
  }

  // Estáticos: caché primero con actualización en segundo plano.
  ev.respondWith(
    caches.match(req).then((cached) => {
      const network = fetch(req)
        .then((res) => {
          if (res && res.status === 200 && res.type === "basic") {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});