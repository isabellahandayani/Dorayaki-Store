var modal = document.getElementById("modal");

var close = document.getElementById("close-btn");

var btns = document.getElementsByClassName("edit-btn");
for (var i = 0; i < btns.length; i++) {
  btns[i].addEventListener("click", function () {
    document.getElementById("amount").innerText = 1;
    modal.style.display = "block";
  });
}

document.querySelector("#decr").addEventListener("click", decr);
document.querySelector("#incr").addEventListener("click", incr);

window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

close.onclick = function () {
  modal.style.display = "none";
};

function incr() {
  var amount = parseInt(document.getElementById("amount").innerText);
  amount++;
  document.getElementById("amount").innerText = amount;
}

function decr() {
  var amount = parseInt(document.getElementById("amount").innerText);
  amount--;
  document.getElementById("amount").innerText = amount >= 0 ? amount : 0;
}
