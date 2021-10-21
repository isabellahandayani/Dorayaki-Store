const IMG_PATH = "../../../backend/image/";

let xhr = new XMLHttpRequest();

var dorayakiData;
var page = 0;

window.onload = () => {
    setNavbar();
    if(!getCookie("sessionID")) {
        window.location.href = "../login/"
    }
    getDorayaki(null);
    var filter = document.location.pathname.includes('?') 
        ? document.location.pathname.split('?')[-1]
        : "";

    console.log(filter);
}

function search() {
    console.log(window);
    window.searchDorayaki();
}

function getDorayaki(name) {
    let url = `../../../backend/api/dorayaki.php`;

    if (name) {
        url += `?name=${name}`;
    }

    xhr.open("GET", url);
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            dorayakiData = JSON.parse(this.response);
            setDorayaki(dorayakiData.slice(0, 4));
        } else {
            console.log(this)
        }
    }

    xhr.send()
}

function filter() {
    let name = document.getElementById("filter").value;
    getDorayaki(name);
}

function setDorayaki(data) {
    let html = "";

    data.forEach(({ id_dorayaki, dorayaki_name, price, photo }) => {
        html += `
        <div id=${id_dorayaki} class="result-card bg-blue" onclick="openDetail(${id_dorayaki})">
            <img src="${IMG_PATH + photo}">
            <div class="info color-white">
                <div>${dorayaki_name}</div>
                <div class="price">Rp. ${price}</div>
            </div>
        </div>
        `
    });

    document.getElementById("dorayaki").innerHTML = html;
    setBtn(page);
}

function openDetail(id) {
    window.location.href = `../detail/?${id}`
}

function pagination(n) {
    page += n;

    setDorayaki(dorayakiData.slice(4 * page, 4 * page + 4))
}

function setBtn(page) {
    if (page >= Math.floor(dorayakiData.length - 1 / 4)) document.getElementById("next-btn").style.display = 'none'
    else document.getElementById("next-btn").style.display = 'block'

    if (page == 0) document.getElementById("prev-btn").style.display = 'none'
    else document.getElementById("prev-btn").style.display = 'block'
}
