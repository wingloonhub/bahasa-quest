const CACHE = "bahasa-quest-v2";
const ASSETS = [
  "./", "./index.html", "./css/style.css",
  "./js/firebase-config.js", "./js/art.js", "./js/questions_exam.js",
  "./js/data.js", "./js/store.js", "./js/sound.js", "./js/firebase.js",
  "./js/report.js", "./js/ui.js", "./js/main.js",
  "./manifest.webmanifest", "./favicon.svg",
  "./icons/icon.svg", "./icons/icon-maskable.svg"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;
  e.respondWith(
    fetch(req).then((res) => {
      if (res && res.status === 200) {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy));
      }
      return res;
    }).catch(() =>
      caches.match(req).then((cached) =>
        cached || (req.mode === "navigate" ? caches.match("./index.html") : Promise.reject(new Error("offline")))
      )
    )
  );
});
