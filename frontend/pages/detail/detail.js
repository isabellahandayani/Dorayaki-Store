let xhr = new XMLHttpRequest();
const API_URL = "http://localhost/spidermen-web/backend/api/";
const IMG_PATH = "../../../backend/image/";
const defaultImg = "../../assets/images/dorayaki.png";

window.onload = () => {
  var id = window.location.hash.split('#')[1];

  xhr.open("GET", API_URL+`detail-dorayaki.php?id_dorayaki=${id}`);
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
  const {dorayaki_name, stock, sold_stock, price, desc, photo} = data;

  document.getElementById('dorayaki-name').innerHTML = dorayaki_name;
  document.getElementById('dorayaki-img').src = photo ? IMG_PATH+photo : defaultImg;
  document.getElementById('stock').innerHTML = `${stock} Biji`;
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

document.querySelector(".del-btn").addEventListener("click", function () {
  // dummy
  deleteDorayaki(
    API_URL+"detail.php",
    deleteCallback,
    "id=40"
  );
});
