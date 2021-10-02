var modal = document.getElementById("modal");

var btn = document.getElementById("edit-btn");

var close = document.getElementById("close-btn");

btn.onclick = function() {
  modal.style.display = "block";
}

document.querySelector("#decr").addEventListener("click", decr);
document.querySelector("#incr").addEventListener("click", incr);


window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

close.onclick = function() {
  modal.style.display = "none";
}

function incr(){
  var amount = parseInt(document.getElementById('amount').innerText);
  amount++;
  document.getElementById("amount").innerText = amount;
}

function decr(){
  var amount = parseInt(document.getElementById('amount').innerText);
  amount--;
  document.getElementById("amount").innerText = amount >= 0? amount : 0;
}