const BASE_URL = "../../../backend/api";

window.onload = () => {
  setNavbar();
  if (!getCookie("sessionID")) {
    window.location.href = "../login/"
  }
  let user_id = getCookie("sessionID").split("-").at(0);
  getHistory(BASE_URL + "/history.php?getHistory=true&idUser=" + user_id, historyCallback);
}


const getHistory = (url, callback) => {
  /*
        GET History Data
  */
  let xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      callback(xhr.responseText);
    }
  };

  xhr.send(null);
};

const historyCallback = (data) => {
  console.log(data);
  let res = JSON.parse(data);
  let table = document.getElementById("table");
  for (var key in res) {
    for (var x in res[key]) {
      table.innerHTML +=
        `
      <tr>
        <td class="body-2">${key}</td>
        <td class="body-2">${res[key][x]['time']}</td>
        <td class="body-2">${res[key][x]['dorayaki_name']}</td>
        <td class="body-2">${res[key][x]['qty']}</td>
        <td class="body-2">${res[key][x]['sum']}</td>
      </tr>
      `;
    }
  }
};

