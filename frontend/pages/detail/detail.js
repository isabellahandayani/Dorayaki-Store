const deleteDorayaki = (url, callback, data) => {
  /*
    DELETE METHOD
  */
  let xhr = new XMLHttpRequest();
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
 console.log(data);
  let res = JSON.parse(data);
  if (res["success"]) {
    alert("Penghapusan Berhasil");
  } else {
    alert("Penghapusan Gagal");
  }
};

document.querySelector(".del-btn").addEventListener("click", function () {
  // dummy
  deleteDorayaki("http://localhost/spidermen-web/backend/api/detail.php", deleteCallback, "id=40");
});
