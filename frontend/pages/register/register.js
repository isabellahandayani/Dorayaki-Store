const BASE_URL = "../../../backend/api";
const xhr = new XMLHttpRequest();
const usernameElement = document.getElementById("username");
const emailElement = document.getElementById("email");
const submitButtonElement = document.getElementById("submit");
let users;

function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

emailElement.addEventListener('input', (event) => {
  event.preventDefault();

  if (emailElement.value.length === 0) {
    emailElement.style.border = "0px solid red"
  } else if (validateEmail(emailElement.value)) {
    emailElement.style.border = "4px solid green"
    submitButtonElement.disabled = false;
  } else {
    emailElement.style.border = "4px solid red"
    submitButtonElement.disabled = true
  }
})

usernameElement.addEventListener('input', function (event) {
  event.preventDefault();
  
  let usernameFound = false;
  const alphabetNumberUnderscoreRegex = /^(?=.{1,255}$)_*[a-zA-Z0-9]+(?:_[a-zA-Z0-9]+)*_*$/
  
  users.map((user) => {
    console.log(user.username);
    if (user.username == usernameElement.value) {
      usernameElement.style.border = "4px solid red";
      submitButtonElement.disabled = true
      usernameFound = true;
    }
  });

  if (!usernameFound) {
    if (usernameElement.value.length === 0) {
      usernameElement.style.border = "0px solid green";
    } else if (usernameElement.value.length !== 0 && alphabetNumberUnderscoreRegex.test(usernameElement.value)) {
      usernameElement.style.border = "4px solid green";
      submitButtonElement.disabled = false;
    } else {
      usernameElement.style.border = "4px solid red";
      submitButtonElement.disabled = true
    }
  }
});

function register(event) {
  event.preventDefault();

  var email = document.getElementById("email").value;
  var username = document.getElementById("username").value;
  var pass = document.getElementById("password").value;

  const data = `email=${email}&password=${pass}&username=${username}`;

  xhr.open("POST", `${BASE_URL}/register.php`);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      const res = JSON.parse(this.response);

      if (res.statusCode == 200) {
        const { sessionID, sessionEnd, isAdmin } = res;
        setCookie("sessionID", sessionID)
        setCookie("sessionEnd", sessionEnd)
        setCookie("isAdmin", isAdmin)

        window.location.href = "../../";
      } else {
        console.log("User Not Found");
      }
    }
  };

  xhr.send(data);
}

window.onload = () => {
  setNavbar();
  if (getCookie("sessionID")) {
    window.location.href = "../../";
  }

  xhr.open("GET", `${BASE_URL}/user.php`, true);
  xhr.onreadystatechange = () => {
    console.log("please", xhr.responseText);
    users = JSON.parse(xhr.responseText);
  };

  xhr.send();
};
