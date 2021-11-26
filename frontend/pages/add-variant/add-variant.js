const BASE_URL = "../../../backend/api";

window.onload = () => {
  setNavbar();
  if (!getCookie("sessionID")) {
    window.location.href = "../login/";
  }
  getDorayakis(
    `${BASE_URL}/add-variant.php?getDorayaki=true`,
    dorayakiCallback
  );
};

const getDorayakis = (url, callback) => {
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

const dorayakiCallback = (data) => {
  console.log(data);
  let res = JSON.parse(data);
  let name = document.getElementById("nama");
  console.log(res);
  let dorayaki = "";
  for (var x of res.return) {
	dorayaki += `<option>${x.name}</option>`
  }
  console.log(dorayaki);
  name.innerHTML = dorayaki;
};
