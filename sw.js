/* Service worker — PWA "Gestão de OS · MOA" (AVCB Gasômetro)
 * ---------------------------------------------------------------------------
 * Objetivo: deixar o app instalável (atalho na área de trabalho / tela
 * inicial) e abrível offline, SEM cair no problema de "atualizei o
 * index.html e o app continua na versão antiga".
 *
 * Estratégia por tipo de requisição:
 *   - navegação (o próprio index.html): NETWORK-FIRST — online sempre pega
 *     a versão recém-publicada; offline abre a última que funcionou.
 *   - libs de CDN (jsdelivr / Google Fonts): CACHE-FIRST — as URLs são
 *     versionadas (imutáveis), então cachear é seguro e deixa o app abrir
 *     sem internet.
 *   - Supabase (REST / Auth / Storage / Functions): NUNCA passa pelo cache
 *     — o app já tem a própria fila offline em IndexedDB.
 *
 * Ao publicar uma nova versão, opcionalmente troque CACHE_VERSION para
 * forçar a limpeza imediata do cache antigo (não é obrigatório: o
 * network-first já garante o HTML novo quando há internet).
 */
const CACHE_VERSION = 'v1';
const RUNTIME = 'goa-runtime-' + CACHE_VERSION;

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k !== RUNTIME).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

function isSupabase(url) {
  return url.hostname.endsWith('.supabase.co') || url.hostname.endsWith('.supabase.in');
}
function isStaticCdn(url) {
  return url.hostname === 'cdn.jsdelivr.net' ||
         url.hostname === 'fonts.googleapis.com' ||
         url.hostname === 'fonts.gstatic.com';
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  let url;
  try { url = new URL(req.url); } catch (e) { return; }

  // Supabase e afins: deixa passar direto, sem tocar.
  if (isSupabase(url)) return;

  // Navegação (abrir/recarregar o app): network-first.
  if (req.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(req);
        const cache = await caches.open(RUNTIME);
        cache.put(req, fresh.clone());
        return fresh;
      } catch (err) {
        const cached = (await caches.match(req)) ||
                       (await caches.match('./')) ||
                       (await caches.match('index.html'));
        if (cached) return cached;
        throw err;
      }
    })());
    return;
  }

  // Libs de CDN versionadas: cache-first.
  if (isStaticCdn(url)) {
    event.respondWith((async () => {
      const cached = await caches.match(req);
      if (cached) return cached;
      try {
        const fresh = await fetch(req);
        if (fresh && fresh.status === 200) {
          const cache = await caches.open(RUNTIME);
          cache.put(req, fresh.clone());
        }
        return fresh;
      } catch (err) {
        if (cached) return cached;
        throw err;
      }
    })());
    return;
  }

  // Mesma origem (sw.js, favicon, etc.): tenta rede, cai pro cache offline.
  if (url.origin === self.location.origin) {
    event.respondWith((async () => {
      try {
        return await fetch(req);
      } catch (err) {
        const cached = await caches.match(req);
        if (cached) return cached;
        throw err;
      }
    })());
  }
});
