const CACHE = 'preflight-checklist-v6';
const FILES = ['./', './index.html', './manifest.json', './icon.svg'];
self.addEventListener('install', event => { event.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener('activate', event => { event.waitUntil((async()=>{const keys=await caches.keys();await Promise.all(keys.filter(k=>k.startsWith('preflight-checklist-')&&k!==CACHE).map(k=>caches.delete(k)));await self.clients.claim()})()); });
self.addEventListener('fetch', event => {
 if(event.request.method!=='GET')return;
 const url=new URL(event.request.url);if(url.origin!==self.location.origin)return;
 if(event.request.mode==='navigate'||url.pathname.endsWith('/index.html')){
  event.respondWith(fetch(event.request).then(r=>{const c=r.clone();caches.open(CACHE).then(x=>x.put('./index.html',c));return r}).catch(()=>caches.match('./index.html')));return;
 }
 event.respondWith(caches.match(event.request).then(c=>c||fetch(event.request).then(r=>{if(r.ok){const cp=r.clone();caches.open(CACHE).then(x=>x.put(event.request,cp))}return r})));
});
