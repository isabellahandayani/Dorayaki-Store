window.getCookie = function (name) {
  var match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  if (match) return match[2];
};

window.getUsername = function () {
  return getCookie("sessionID").split("-").at(-1);
}

window.searchDorayaki = () => {
  const name = document.getElementById("filter").value;
  window.location.pathname = `frontend/pages/search/?name=${name}`
};

window.logout = () => {
  deleteCookie("sessionID");
  deleteCookie("sessionEnd");
  deleteCookie("isAdmin");
}

const deleteCookie = (name) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

const setNavbar = () => {
  const sessionID = window.getCookie("sessionID");
  
  if (!sessionID) {
    document.getElementById("nav-username").style.display = "none";
    // document.getElementById("nav-cart").style.display = "none";
    document.getElementById("nav-login-logout-button").innerHTML = "Login";
    document.getElementById("nav-login-logout-button").onclick = () => {
      window.location.pathname = "frontend/pages/login/"
    };
  } else {
    document.getElementById("nav-username").innerText = window.getUsername();
    document.getElementById("nav-login-logout-button").innerHTML = "Logout";
    document.getElementById("nav-login-logout-button").onclick = () => {
      window.logout();
      window.location.pathname = "frontend/pages/login"
    };
  }
}