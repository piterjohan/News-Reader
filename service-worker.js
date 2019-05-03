const CACHE_NAME = "News-Reader";
var urlsToCache = [
    "/",
    // asset
    "asset/css/materialize.min.css",
    "asset/js/materialize.min.js",
    "asset/js/nav.js",
    "asset/js/api.js",
    "asset/img/logo/icon_codepolitan.png",
    "asset/img/Chrysanthemum.jpg",
    "asset/img/Desert.jpg",
    "asset/img/Hydrangeas.jpg",
    "asset/manifest/manifest.json",
    // index
    "index.html",
    "nav.html",
    // pages
    "pages/home.html",
    "pages/about.html",
    "pages/contact.html",
    "article.html",
];

//Install a service worker
self.addEventListener("install", function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(function (cache) {
            return cache.addAll(urlsToCache);
        })
    );
});

// Cache and return requests
self.addEventListener("fetch", function (event) {
    event.respondWith(
        caches
        .match(event.request, {
            cacheName: CACHE_NAME
        })
        .then(function (response) {
            if (response) {
                console.log("ServiceWorker: Gunakan aset dari cache: ", response.url);
                return response;
            }
            console.log("ServiceWorker: Memuat Aset dari Server : ", event.request.url);
            return fetch(event.request);
        })
    );
});

//penghapusan cache yang lama agar tidak membebani pengguna.
self.addEventListener("activate", function (event) {
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.map(function (cacheName) {
                    if (cacheName != CACHE_NAME) {
                        console.log("ServiceWorker: cache" + cacheName + "Dihapus");
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});