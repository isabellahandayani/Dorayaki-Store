window.onclick = function (event) {
  `
    Close Modal
  `;
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

document.getElementById("submit").onclick = function (event) {
  `
    Submit Order Event
  `;
  event.preventDefault();
  postItem("../../../backend/api/checkout.php", confirmCallback, "buy=true");
};

document.getElementById("update").onclick = function (event) {
  `
    Update Stock Event
  `;
  event.preventDefault();
  putItem("../../../backend/api/checkout.php", confirmCallback, "update=true");
};

const editEvent = () => {
  `
    Add Modal to Page
  `;
  let modal = document.getElementById("modal");
  let btns = document.getElementsByClassName("edit-btn");

  for (var i = 0; i < btns.length; i++) {
    btns[i].addEventListener("click", function () {
      modal.style.display = "block";
      modal.innerHTML = templateModal(this.id);

      getItem("../../../backend/api/checkout.php?id=" + this.id.split("-").at(-1), amtCallback);
      editButtons();
    });
  }
};

const templateModal = (id) => {
  return (
    `
  <div class="modal-content bg-blue">
    <p class="body-1 color-white">Yakin?</p>
    <div class="update-box">
      <i class="fa fa-minus-circle color-white" id="decr"></i>
      <p class="body-2 color-white ` +
    id +
    `" id="amount">1</p>
      <i class="fa fa-plus-circle color-white" id="incr"></i>
    </div>
  </div>
  `
  );
};

const templateItem = (photo, name, id, price) => {
  return (
    `
  <img src="` +
    photo +
    `" alt="` +
    name +
    `"/>
  <div class="desc">
    <button class="body-2 bg-yellow color-white edit-btn" id="dor-` +
    id +
    `">Edit</button>
    <p class="body-1 color-white">` +
    name +
    `</p>
    <p class="body-2 color-white">` +
    price +
    `</p>
  </div>

  `
  );
};

const templateBill = (name, id, qty, price) => {
  return (
    `
  <p class="body-2 color-white">` +
    name +
    `</p>
  <p class="body-2 color-white item-` +
    id +
    `">` +
    qty +
    `x` +
    price +
    `</p> 
  `
  );
};

const editButtons = () => {
  ` 
    Set event listener for buttons
  `;
  document.querySelector("#incr").addEventListener(
    "click",
    function () {
      let id = document.getElementById("amount").className.split(" ").at(-1);
      let amount = parseInt(document.getElementById("amount").innerText);
      amount++;
      getItem(
        "../../../backend/api/checkout.php?id=" + id.split("-").at(-1) + "&amt=" + amount,
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
        "../../../backend/api/checkout.php?id=" + id.split("-").at(-1) + "&amt=" + amount,
        updateCallback
      );
    },
    false
  );
};

const getItem = (url, callback) => {
  `
  AJAX for GET
  `;
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
  `
  AJAX for POST
  `;
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
  `
    PUT METHOD
  `;
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
  `
  Add User Order Item to Page
  
  data : xhr.responseText
  `;
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
      let item = document.createElement("div");
      item.classList.add("item", "bg-blue");

      // Add Cart Item
      item.innerHTML = templateItem(
        res[key]["photo"],
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
        res[key]["qty"],
        res[key]["price"]
      );
      bill.appendChild(bill_item);
    }
    editEvent();
  }
};

const updateCallback = (data) => {
  `
    Update Number of Order
  `;
  console.log(data);
  let res = JSON.parse(data);
  let amount = document.getElementById("amount");
  if (Number(res["stock"]) >= Number(res["amt"]) || res["isAdmin"]) {
    amount.innerText = res["amt"];
    let item = document.getElementsByClassName("item-" + res["id_dorayaki"])[0];
    item.innerHTML = res["amt"] + `x` + res["price"];
  } else {
    alert("Stok Tidak Cukup");
  }
};

const totalCallback = (data) => {
  `
    Update Total Price
  `;
  let res = JSON.parse(data);
  let total = document.getElementById("total");

  total.innerHTML = "Rp" + res["total"];
};

const amtCallback = (data) => {
  `
    Get Amount for Edit Modal
  `;
  let res = JSON.parse(data);
  let amount = document.getElementById("amount");
  amount.innerText = res["amt"];
};

const confirmCallback = (data) => {
  `
    Succesful Submit Confirmation
  `;
  let res = JSON.parse(data);
  if (!res["success"]) {
    alert("Gagal");
  }

  if (res["success"] && !res["isAdmin"]) {
    alert("Pembelian Berhasil");
  }

  if (res["success"] && res["isAdmin"]) {
    alert("Perubahan Berhasil");
  }
  location.reload();
};

const checkAdmin = (data) => {
  `
    Check if user is Admin
  `;
  let res = JSON.parse(data);
  let update_btn = document.getElementById("update");
  if (res["isAdmin"]) {
    let trans = document.getElementById("transaction");
    trans.style.display = "none";
    update_btn.style.display = "block";
  } else {
    // Short Polling for Price
    setInterval(function () {
      getItem("../../../backend/api/checkout.php?getTotal=true", totalCallback);
    }, 50);
    update_btn.style.display = "none";
  }
  // Populate Cart Item
  getItem("../../../backend/api/checkout.php?getItem=true", cartCallback);
};

postItem("../../../backend/api/checkout.php", checkAdmin, "checkAdmin=true");