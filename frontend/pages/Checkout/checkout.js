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
  postItem("checkout.php", buyCallback, "buy=true");
};

const editEvent = () => {
  `
    Add Modal to Page
  `;
  var modal = document.getElementById("modal");
  var btns = document.getElementsByClassName("edit-btn");
  for (var i = 0; i < btns.length; i++) {
    btns[i].addEventListener("click", function () {
      modal.style.display = "block";
      modal.innerHTML =
        `
      <div class="modal-content bg-blue">
        <p class="body-1 color-white">Yakin?</p>
        <div class="update-box">
          <i class="fa fa-minus-circle color-white" id="decr"></i>
          <p class="body-2 color-white ` +
        this.id +
        `" id="amount">1</p>
          <i class="fa fa-plus-circle color-white" id="incr"></i>
        </div>
      </div>
      `;

      getItem("checkout.php?id=" + this.id.split("-").at(-1), amtCallback);
      editQuantity();
    });
  }
};

const editQuantity = () => {
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
        "checkout.php?id=" + id.split("-").at(-1) + "&amt=" + amount,
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
        "checkout.php?id=" + id.split("-").at(-1) + "&amt=" + amount,
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

const cartCallback = (data) => {
  `
  Add User Order Item to Page
  
  data : xhr.responseText
  `;
  let res = JSON.parse(data);
  let list = document.getElementsByClassName("content")[0];
  let bill = document.getElementsByClassName("list-item")[0];
  list.innerHTML = "";
  bill.innerHTML = "";
  for (const [key, value] of Object.entries(res)) {
    let item = document.createElement("div");
    item.classList.add("item", "bg-blue");

    // Add Cart Item
    item.innerHTML =
      `
      <img src="` +
      res[key]["photo"] +
      `" alt="` +
      res[key]["dorayaki_name"] +
      `"/>
      <div class="desc">
      <button class="body-2 bg-yellow color-white edit-btn" id="dor-` +
      key +
      `">Edit</button>
      <p class="body-1 color-white">` +
      res[key]["dorayaki_name"] +
      `</p>
      <p class="body-2 color-white">` +
      res[key]["price"] +
      `</p>
      </div>
    
      `;

    // Add Bill Items
    list.appendChild(item);
    let bill_item = document.createElement("div");
    bill_item.classList.add("bill-item");
    bill_item.innerHTML =
      `
    <p class="body-2 color-white">` +
      res[key]["dorayaki_name"] +
      `</p>
    <p class="body-2 color-white item-` +
      key +
      `">` +
      res[key]["amt"] +
      `x` +
      res[key]["price"] +
      `</p> 
    `;
    bill.appendChild(bill_item);
  }

  editEvent();
};

const updateCallback = (data) => {
  `
    Update Number of Order
  `;
  let res = JSON.parse(data);

  let amount = document.getElementById("amount");
  if (res["status"]) {
    amount.innerText = res["amt"];
    let item = document.getElementsByClassName("item-" + res["id"])[0];
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

const buyCallback = (data) => {
  `
    Buy Confirmation
  `;
  let res = JSON.parse(data);
  if (res["success"]) {
    alert("Pembelian Berhasil");
  }
};

// Populate Cart Item
getItem("checkout.php?getItem=true", cartCallback);

// Short Polling for Price
setInterval(function () {
  getItem("checkout.php?getTotal=true", totalCallback);
}, 500);
