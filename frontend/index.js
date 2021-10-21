const URL_PATH = "../../../backend/api/dorayaki.php";
const IMG_PATH = "../../../backend/image/";
let xhr = new XMLHttpRequest();

window.onload = () => {
  setNavbar();
  if(!getCookie("SessionID")) {
    window.location.href = "pages/login/"
  }
  xhr.open("GET", URL_PATH);
  xhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      let res = JSON.parse(this.response);
      console.table(res);
      setDashboard(res.slice(0, 9));
    } else {
      console.log(this);
    }
  }

  xhr.send()
}

function setDashboard(data) {
  let html = '';

  data.forEach(({ id_dorayaki, dorayaki_name, price, photo }) => {
    html += `
      <div class="dashboard-item-card" onclick={openDetail(${id_dorayaki})}>
          <div class="overlay"></div>
          <img src="${IMG_PATH + photo}" class="bg-img">
          <div class="desc">
              <h4 class="h4">${dorayaki_name}</h4>
              <p class="body-1">Rp ${price}</p>
          </div>
      </div>
    `;
  });

  document.getElementById('dorayaki').innerHTML = html;
}

function openDetail(id) {
  window.location.href = `pages/detail/?${id}`;
}
