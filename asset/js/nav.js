document.addEventListener("DOMContentLoaded", function () {
    //active side bar
    var sidebar = document.querySelectorAll(".sidenav");
    M.Sidenav.init(sidebar);
    loadNav();

    function loadNav() {

        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4) {
                if (this.status != 200) return;

                // Muat daftar tautan menu
                document.querySelectorAll(".topnav, .sidenav").forEach(function (elm) {
                    elm.innerHTML = xhttp.responseText;
                });

                //daftarkan event listener untuk setiap tautan menu
                document.querySelectorAll(".sidenav a, .topnav a")
                    .forEach(function (elm) {
                        elm.addEventListener("click", function (event) {
                            //tutup sidenav
                            var sidenav = document.querySelector(".sidenav");
                            M.Sidenav.getInstance(sidenav).close();

                            //muat konten halaman yang di panggil
                            page = event.target.getAttribute("href").substr(1);
                            loadPage(page);
                        });
                    });
            }
        };
        xhttp.open("GET", "nav.html", true);
        xhttp.send();
    }

    //Load Page Content
    var page = window.location.hash.substr(1);
    if (page == '') page = "home";
    loadPage(page);

    function loadPage(page) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4) {
                var content = document.querySelector("#body-content");
                if (this.status == 200) {
                    content.innerHTML = xhttp.responseText;
                } else if (this.status == 404) {
                    content.innerHTML = "<p> Halaman tidak ditemukan</p>";
                } else {
                    content.innerHTML = "<p> Ups.. Halaman Tidak Dapat diAkses</p>";
                }
            }
        };

        xhttp.open("GET", "pages/" + page + ".html", true);
        xhttp.send();

    }
    //slider
    // var slider = document.querySelectorAll('.slider')
    // M.Slider.init(slider, {
    //     indicators: false,
    //     height: 400,
    //     transition: 600,
    //     interval: 3000
    // });


});