let xhr = new XMLHttpRequest();
const API_URL = "../../../backend/api/";
const IMG_PATH = "../../../backend/image/";
const defaultImg = "../../assets/images/dorayaki.png";

window.onload = () => {
  setNavbar();

  var id = window.location.href.split('?')[1];

  console.log("test", id)

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
}

const deleteDorayaki = (url, callback, data) => {
  /*
    DELETE METHOD
  */
  xhr.overrideMimeType("application/json");
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
  if (res["success"]) {
    alert("Penghapusan Berhasil");
  } else {
    alert("Penghapusan Gagal");
  }
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
  let id = window.location.hash.split('?')[1];

  deleteDorayaki(
    API_URL + "detail.php",
    deleteCallback,
    `id=${id}`
  );
});
