const BASE_URL = "../../../backend/api"

function setCookie(name, value) {
  document.cookie = `${name}= ${value}; path=/`;
}

function login(event) {
  event.preventDefault();
  var username = document.getElementById('username').value;
  var pass = document.getElementById('password').value;

  const xhr = new XMLHttpRequest();
  xhr.open("POST", `${BASE_URL}/login.php`);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  xhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      const res = JSON.parse(this.response)

      console.table(this.response);

      if (res.statusCode == 200) {
        const { sessionID, sessionEnd, isAdmin } = res;
        setCookie("sessionID", sessionID);
        setCookie("sessionEnd", sessionEnd);
        setCookie("isAdmin", isAdmin);

        console.log("test", document.cookie)

        window.location.href = "../../index.html";
      } else {
        console.log("MEH");
      }
    } else {
      console.log(this)
    }
  }

  xhr.send(`username=${username}&password=${pass}`);
}

window.onload = () => {
  setNavbar();
}