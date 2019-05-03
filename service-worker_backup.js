const CACHE_NAME = "News-Reader1";
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
    var base_url = "https://readerapi.codepolitan.com/";
    /* memeriksa apakah fetch saat ini meminta data dari api 
    (url yang diminta mengandung isi base_url).
    */
    /*Method indexOf akan mengembalikan nilai -1 
    jika base_url tidak ada di request saat ini dan akan bernilai 
    lebih dari -1 jika url yang diminta mengandung isi base_url.
    */
    if (event.request.url.indexOf(base_url) > -1) {
        event.respondWith(
            caches.open(CACHE_NAME)
            .then(function (cache) {
                return fetch(event.request)
                    .then(function (response) {
                        cache.put(event.request.url, response, clone());
                        return response;
                    })
            })
        );
    } else {
        event.respondWith(
            caches.match(event.request)
            .then(function (response) {
                return response || fetch(event.request);
            })
        )
    }
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