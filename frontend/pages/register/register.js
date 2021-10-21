const BASE_URL = "../../../backend/api"

function register(event) {
  event.preventDefault();

  var email = document.getElementById('email').value;
  var username = document.getElementById('username').value;
  var pass = document.getElementById('password').value;
  
  const data = `email=${email}&password=${pass}&username=${username}`;

  const xhr = new XMLHttpRequest();
  xhr.open("POST",`${BASE_URL}/register.php`);
  xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
  xhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      const res = JSON.parse(this.response);
      
      if (res.statusCode == 200){
        const { sessionID, sessionEnd, isAdmin } = res;
        document.cookie = `sessionID=${sessionID}; sesionEnd=${sessionEnd}; isAdmin=${isAdmin};`;
        
        window.location.href = "frontend/index.html";
      }else {
        console.log("User Not Found")
      }
    }
  }

  xhr.send(data);
}

window.onload = () => {
  setNavbar();
}