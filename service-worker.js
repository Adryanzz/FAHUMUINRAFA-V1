
const CACHE_NAME = 'fahum-cache-v3';
const PRECACHE = [
  './','./index.html','./style.css','./script.js','./manifest.json'
];
self.addEventListener('install', (e)=>{ e.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(PRECACHE))); self.skipWaiting(); });
self.addEventListener('activate', (e)=>{ e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', (e)=>{
  if(e.request.method !== 'GET') return;
  // stale-while-revalidate for navigation and assets
  e.respondWith(caches.open(CACHE_NAME).then(async cache => {
    const cached = await cache.match(e.request);
    const networkFetch = fetch(e.request).then(resp => { if(resp && resp.ok) cache.put(e.request, resp.clone()); return resp; }).catch(()=>null);
    return cached || networkFetch || caches.match('./index.html');
  }));
});
