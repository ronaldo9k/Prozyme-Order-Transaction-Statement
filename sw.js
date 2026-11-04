/* 최소 서비스워커: 오프라인 캐시 (앱 셸만) */
const C = 'prozyme-v3'; // 캐시 버전을 v3로 올려 브라우저가 새 아이콘을 즉시 인식하도록 합니다.

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(C).then(c => 
      c.addAll([ 
        './index.html', 
        './manifest.json',
        './KJM.png' // 새로운 앱 아이콘 이미지 파일을 캐시 목록에 추가합니다.
      ])
    )
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(ks => 
      Promise.all(
        ks.filter(k => k !== C).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
