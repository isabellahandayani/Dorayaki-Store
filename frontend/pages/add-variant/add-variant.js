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
  let res = JSON.parse(data);
  let name = document.getElementById("nama");
  let dorayaki = "";
  try {
    for (var x of res.return) {
      dorayaki += `<option ${x.id}>${x.name}</option>`;
    }
  } catch (e) {
    try {
      dorayaki += `<option ${res.return.id}>${res.return.name}</option>`;
    } catch (e) {
      alert("Rate Limit Reached");
	  window.location.pathname = "frontend/";
      return;
    }
  }

  if (dorayaki.length == 0) {
    alert("No Dorayaki Found");
  } else {
    name.innerHTML = dorayaki;
  }
};
