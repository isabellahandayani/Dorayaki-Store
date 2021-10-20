let xhr = new XMLHttpRequest();

var dorayakiData;
var page = 0;

function getDorayaki(name) {
    let url = "http://localhost/spidermen-web/backend/api/dorayaki.php";

    if (name){
        url += `?name=${name}`;
    }

    xhr.open("GET", url);
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200){
            dorayakiData = JSON.parse(this.response);
            setDorayaki(dorayakiData.slice(0, 4));
        }
    }

    xhr.send()
}

window.onload = () => {
    getDorayaki(null);
}

function filter() {
    let name = document.getElementById("filter").value;
    getDorayaki(name);
}

function setDorayaki(data){
    let html = "";
    
    data.forEach(({id_dorayaki, dorayaki_name, price, photo}) => {
        html += `
        <div id=${id_dorayaki} class="result-card bg-blue">
            <img src="${photo}">
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

function pagination(n) {
    page += n;  

    setDorayaki(dorayakiData.slice(4*page, 4*page + 4))
}

function setBtn(page) {
    if (page >= Math.floor(dorayakiData.length-1/4)) document.getElementById("next-btn").style.display = 'none'
    else document.getElementById("next-btn").style.display = 'block'

    if (page == 0) document.getElementById("prev-btn").style.display = 'none'
    else document.getElementById("prev-btn").style.display = 'block'
}
