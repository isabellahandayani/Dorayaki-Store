let xhr = new XMLHttpRequest();
const API_URL = "../../../backend/api/";
const IMG_PATH = "../../../backend/image/";
const defaultImg = "../../assets/images/dorayaki.png";

window.onload = () => {
  setNavbar();

  if(!getCookie("SessionID")) {
    window.location.href = "../login/"
  }
  var id = window.location.href.split('?')[1];

  xhr.open("GET", API_URL + `detail-dorayaki.php?id_dorayaki=${id}`);
  xhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      let res = JSON.parse(xhr.response);

      if (res.statusCode == 200) {
        loadData(res.data);
      }
    }
  }

  xhr.send();
};

const loadData = (data) => {
  const { dorayaki_name, stock, sold_stock, price, desc, photo } = data;

  document.getElementById('dorayaki-name').innerHTML = dorayaki_name;
  document.getElementById('dorayaki-img').src = photo ? IMG_PATH + photo : defaultImg;
  document.getElementById('stock').innerHTML = `${stock} Buah`;
  document.getElementById('price').innerHTML = `Rp. ${price}`;
  document.getElementById('sold').innerHTML = `${sold_stock} Terjual`;
  document.getElementById('desc').innerHTML = desc;
  document.title = `Dorayaki ${dorayaki_name}`;
}

const deleteDorayaki = (url, callback, data) => {
  /*
    DELETE METHOD
  */
  // xhr.overrideMimeType("application/json");
  xhr.open("DELETE", url, true);
  xhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      callback(xhr.responseText);
    }
  };

  data ? xhr.send(data) : xhr.send(null);
};

const deleteCallback = (data) => {
  /*
    Delete Confirmation Status
  */
 let res = JSON.parse(data);
 console.log(res);
  if (res["statusCode"]) {
    alert("Penghapusan Berhasil");
  } else {
    alert("Penghapusan Gagal");
  }
  window.location.href = "../../"
};

const buyDorayaki = (event) => {
  event.preventDefault();
  var id = window.location.href.split('?')[1];
  let xhr = new XMLHttpRequest();
  xhr.open("POST", API_URL + "checkout.php", true);
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      console.log(xhr.responseText);
      window.location.pathname = "frontend/pages/checkout/"
    }
  };

  xhr.send(`id=${id}`)
};

document.querySelector(".del-btn").addEventListener("click", function () {
  /*
    DELETE DORAYAKI
  */
  var id = window.location.href.split('?')[1];
  deleteDorayaki(
    API_URL + "detail.php",
    deleteCallback,
    `id=${id}`
  );
});
