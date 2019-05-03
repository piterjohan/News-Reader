var base_url = "https://readerapi.codepolitan.com/";

//panggil blok fetch jika berhasil
function status(response) {
    if (response.status !== 200) {
        console.log("Error : " + response.status);
        //method reject() akan memangil blok catch terpanggil
        return Promise.reject(new Error(response.statusText));
    } else {
        //mengubah objek menjadi promise agar dapat "di-then-kan"
        return Promise.resolve(response);
    }
}
// Blok kode untuk memparsing json menjadi array JavaScript
function json(response) {
    return response.json();
}

// Blok kode untuk meng-handle kesalahan di blok catch
function error(error) {
    // Parameter error berasal dari Promise.reject()
    console.log("Error Reject Promise : " + error);
}

// Blok kode untuk melakukan request data json
function getArticles() {
    /*memuat data dari cache terlebih dahulu sebelum melakukan request ke server api */

    if ('caches' in window) {
        caches.match(base_url + "articles")
            .then(function (response) {
                if (response) {
                    response.json()
                        .then(function (data) {
                            var articlesHTML = "";
                            data.result.forEach(function (article) {
                                articlesHTML +=
                                    `
                                <div class="card">
                                    <a href="../../article.html?id=${article.id}">
                                        <div class="card-image waves-effect waves-block waves-light">
                                            <img src="${article.thumbnail}"/>
                                        </div>
                                    </a>

                                    <div class="card-content">
                                        <span class="card-title truncate"> ${article.title}</span>
                                        <p>${article.description}</p>
                                    </div>
                                </div>
                             `;
                            });
                            // Sisipkan komponen card ke dalam elemen dengan id #content
                            document.getElementById("articles").innerHTML = articlesHTML;
                        })
                }
            })
    }

    fetch(base_url + "articles")
        .then(status)
        .then(json)
        .then(function (data) {
            // Objek/array JavaScript dari response.json() masuk lewat data.
            //kemudian
            // Menyusun komponen card artikel secara dinamis

            var articlesHTML = "";
            data.result.forEach(function (article) {
                articlesHTML +=
                    `
                <div class="card">
                    <a href="../../article.html?id=${article.id}">
                        <div class="card-image waves-effect waves-block waves-light">
                            <img src="${article.thumbnail}"/>
                        </div>
                    </a>

                    <div class="card-content">
                        <span class="card-title truncate">${article.title}</span>
                        <p>${article.description}</p>
                    </div>
                </div>
                `;
            });
            // Sisipkan komponen card ke dalam elemen dengan id #content
            document.getElementById("articles").innerHTML = articlesHTML;
        })
        .catch(error);
}

//get articles byID
function getArticlesById() {
    //ambil nilai query parameter (?id=)
    var urlParams = new URLSearchParams(window.location.search);
    var idParam = urlParams.get("id");

    fetch(base_url + "article/" + idParam)
        .then(status)
        .then(json)
        .then(function (data) {
            // Objek JavaScript dari response.json() masuk lewat variabel data.
            console.log(data);
            // Menyusun komponen card artikel secara dinamis
            var articleHTML =
                `
                <div class="card">
                    <div class="card-image waves-effect waves-block waves-light">
                        <img src="${data.result.cover}"/>
                    </div>

                    <div class="card-content">
                        <span class="card-title">${data.result.post_title}</span>
                        ${snarkdown(data.result.post_content)}
                    </div>
                </div>
            `;
            // Sisipkan komponen card ke dalam elemen dengan id #content
            document.getElementById("body-content").innerHTML = articleHTML;
        });
}