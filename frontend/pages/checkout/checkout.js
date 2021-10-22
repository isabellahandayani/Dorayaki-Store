const BASE_URL = "../../../backend/api";
const IMG_PATH = "../../../backend/image/";

window.onload = () => {
  setNavbar();
  if(!getCookie("sessionID")) {
    window.location.href = "../login/"
  }
  checkAdmin();
};

window.onclick = function (event) {
  /*
    Close Modal
  */
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

const getOrder = () => {
  /*
    Get order from cookie
  */
  let value = document.cookie + ";";
  let regex = /item-.*;/g;
  var matches = {};
  let match = (regex.exec(value))[0].split(" ");
  for(item of match) {
    let x = item.toString().split("=");
    let id = x[0].split("-").at(-1);
    console.log(x[1]);
    let qty = x[1].replace(";","");
    matches[id] = qty;
    deleteCookie(`item-${id}`);
  }
  return matches;
};

document.getElementById("submit").onclick = function (event) {
  /*
    Submit Order Event
  */
  event.preventDefault();

  let idUser = getCookie('sessionID').split('-')[0];
  postItem(
    BASE_URL + "/checkout.php",
    confirmCallback,
    `data=${JSON.stringify(getOrder())}&idUser=${idUser}`
  );
};

document.getElementById("update").onclick = function (event) {
  /*
    Update Stock Event
  */
  event.preventDefault();
  putItem(
    `${BASE_URL}/checkout.php`,
    confirmCallback,
    "data=" + JSON.stringify(getOrder())
  );
};

const editEvent = () => {
  /*
    Add Modal to Page
  */
  let modal = document.getElementById("modal");
  let btns = document.getElementsByClassName("edit-btn");

  for (var i = 0; i < btns.length; i++) {
    btns[i].addEventListener("click", function () {
      modal.style.display = "block";
      modal.innerHTML = templateModal(this.id);
      editButtons();
    });
  }
};

const templateModal = (id) => {
  /*
    Modal template
  */
  let key = id.split("-").at(-1);
  return `
  <div class="modal-content bg-blue">
    <p class="body-1 color-white">Yakin?</p>
    <div class="update-box">
      <i class="fa fa-minus-circle color-white" id="decr"></i>
      <p class="body-2 color-white ${id}" id="amount">${getCookie(
    `item-${key}`
  )}</p>
      <i class="fa fa-plus-circle color-white" id="incr"></i>
    </div>
  </div>
  `;
};

const templateItem = (photo, name, id, price) => {
  /*
    Cart Item Template
  */
  return `
  <img src="${photo}" alt="${name}"/>
  <div class="desc">
    <button class="body-2 bg-yellow color-white edit-btn" id="dor-${id}">Edit</button>
    <p class="body-1 color-white">${name}</p>
    <p class="body-2 color-white">${formatMoney(price)}</p>
  </div>
  `;
};

const templateBill = (name, id, qty, price) => {
  /*
    Bill template
  */
  return `
  <p class="body-2 color-white">${name}</p>
  <p class="body-2 color-white item-${id}">${qty}x ${formatMoney(price)}</p> 
  `;
};

const editButtons = () => {
  /* 
    Set event listener for buttons
  */
  document.querySelector("#incr").addEventListener(
    "click",
    function () {
      let id = document.getElementById("amount").className.split(" ").at(-1);
      let amount = parseInt(document.getElementById("amount").innerText);
      amount++;
      getItem(
        `${BASE_URL}/checkout.php?id=${id.split("-").at(-1)}&amt=${amount}`,
        updateCallback
      );
    },
    false
  );

  document.querySelector("#decr").addEventListener(
    "click",
    function () {
      let id = document.getElementById("amount").className.split(" ").at(-1);
      let amount = parseInt(document.getElementById("amount").innerText);
      amount--;
      amount = amount >= 1 ? amount : 1;
      getItem(
        `${BASE_URL}/checkout.php?id=${id.split("-").at(-1)}&amt=${amount}`,
        updateCallback
      );
    },
    false
  );
};

const getItem = (url, callback) => {
  /*
  AJAX for GET
  */
  let xhr = new XMLHttpRequest();
  xhr.overrideMimeType("application/json");
  xhr.open("GET", url, true);
  xhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      callback(xhr.responseText);
    }
  };

  xhr.send(null);
};

const postItem = (url, callback, data) => {
  /*
  AJAX for POST
  */
  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      callback(xhr.responseText);
    }
  };

  data ? xhr.send(data) : xhr.send();
};

const putItem = (url, callback, data) => {
  /*
    PUT METHOD
  */
  let xhr = new XMLHttpRequest();
  xhr.open("PUT", url, true);
  xhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      callback(xhr.responseText);
    }
  };

  data ? xhr.send(data) : xhr.send();
};

const cartCallback = (data) => {
  /*
  Add User Order Item to Page
  
  data : xhr.responseText
  */

  let res = JSON.parse(data);
  let list = document.getElementsByClassName("content")[0];

  // Check if there are item in order/update
  if (res.length == 0) {
    let update_btn = document.getElementById("update");
    let trans = document.getElementById("transaction");
    list.innerHTML = `
      <h1 class="color-blue">Belum Ada Barang :D</h1>
    `;

    update_btn.style.display = "none";
    trans.style.display = "none";
  } else {
    let bill = document.getElementsByClassName("list-item")[0];
    list.innerHTML = "";
    bill.innerHTML = "";
    for (const [key, value] of Object.entries(res)) {
      let photo = IMG_PATH + res[key]["photo"];
      let item = document.createElement("div");
      item.classList.add("item", "bg-blue");

      // Add Cart Item
      item.innerHTML = templateItem(
        photo,
        res[key]["dorayaki_name"],
        key,
        res[key]["price"]
      );
      list.appendChild(item);

      // Add Bill Items
      let bill_item = document.createElement("div");
      bill_item.classList.add("bill-item");
      bill_item.innerHTML = templateBill(
        res[key]["dorayaki_name"],
        key,
        1,
        res[key]["price"]
      );
      bill.appendChild(bill_item);
      setCookie(`item-${key}`, 1);
    }
    editEvent();
  }
};

const updateCallback = (data) => {
  /*
    Update Number of Order
  */
  console.log(data);
  let res = JSON.parse(data);
  let amount = document.getElementById("amount");
  if (
    Number(res["stock"]) >= Number(res["qty"]) ||
    getCookie("isAdmin") === "1"
  ) {
    console.log(res["qty"]);
    amount.innerText = res["qty"];
    let item = document.getElementsByClassName("item-" + res["id_dorayaki"])[0];
    item.innerHTML = res["qty"] + `x` + formatMoney(res["price"]);
    deleteCookie(`item-${res["id_dorayaki"]}`);
    setCookie(`item-${res["id_dorayaki"]}`, res["qty"]);
  } else {
    alert("Stok Tidak Cukup");
  }
};

const totalCallback = (data) => {
  /*
    Update Total Price
  */
  let res = JSON.parse(data);
  let total = document.getElementById("total");
  let sum = 0;
  for (key in res) {
    sum += res[key]["price"] * Number(getCookie(`item-${key}`));
  }
  total.innerHTML = formatMoney(sum);
};

const confirmCallback = (data) => {
  /*
    Succesful Submit Confirmation
  */
 console.log(data);
 console.log(getCookie("isAdmin"));
  let res = JSON.parse(data);
  if (!res["success"]) {
    alert("Gagal");
  }
  if (res["success"] && getCookie("isAdmin") == 0) {
    alert("Pembelian Berhasil");
  }

  if (res["success"] && getCookie("isAdmin") == 1) {
    alert("Perubahan Berhasil");
  }
  location.reload();
};

const checkAdmin = () => {
  /*  
    Check if user is Admin
  */
  let isAdmin = getCookie("isAdmin");
  let update_btn = document.getElementById("update");
  if (isAdmin === "1") {
    let trans = document.getElementById("transaction");
    trans.style.display = "none";
  } else {
    // Short Polling for Price
    setInterval(function () {
      getItem(`${BASE_URL}/checkout.php?getItem=true`, totalCallback);
    }, 500);
    update_btn.style.display = "none";
  }
  // Populate Cart Item
  getItem(`${BASE_URL}/checkout.php?getItem=true`, cartCallback);
};
