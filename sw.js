/* 최소 서비스워커: 오프라인 캐시 (앱 셸만) */
const C = 'prozyme-v2'; // <- 따옴표 꼭 붙여주세요!
self.addEventListener('install', e => {
  e.waitUntil(caches.open(C).then(c => c.addAll([ './index.html', './manifest.json' ])));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
