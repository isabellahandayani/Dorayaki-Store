const getCookie = function (name) {
  var match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  if (match) return match[2];
};

const validateAdmin = () => {
  return getCookie("isAdmin") === "1";
};

const goToAddVariant = () => {
  window.location.pathname = "frontend/pages/add-variant/";
};

window.getUsername = function () {
  return getCookie("sessionID").split("-").at(-1);
};

window.searchDorayaki = () => {
  const name = document.getElementById("filter").value;
  // window.location.href = (window.location.href.includes('pages'))
  //  (window.location.href.includes('pages')) ? `../search/?name=${name}` : `pages/search/?name=${name}`;
  window.history.replaceState(
    {},
    document.title,
    "/" + `frontend/pages/search/?name=${name}`
  );
  window.location.reload(false);
};

window.logout = () => {
  deleteCookie("sessionID");
  deleteCookie("sessionEnd");
  deleteCookie("isAdmin");
};

const formatMoney = (amount) => {
  let res = amount < 0 ? "-Rp " : "Rp ";
  amount = amount < 0 ? amount * -1 : amount;

  return amount != 0
    ? res + amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    : "0";
};

const deleteCookie = (name) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

function setCookie(name, value) {
  document.cookie = `${name}= ${value}; path=/`;
}

const setNavbar = () => {
  const sessionID = getCookie("sessionID");
  const sessionEnd = getCookie("sessionEnd");

  if (sessionID && sessionEnd){
    let now = new Date();
    let endDate = new Date(sessionEnd);

    if (now > endDate){
      alert("Session Ended! Redirecting to login page...")
  
      window.logout();
  
      window.location.pathname = "frontend/pages/login/";
      return;
    }
  }

  if (!sessionID) {
    document.getElementById("nav-username").style.display = "none";
    document.getElementById("nav-add-item").style.display = "none";
    document.getElementById("nav-auth-button").innerHTML =
      window.location.pathname.includes("login") ? "Register" : "Login";
    document.getElementById("nav-auth-button").onclick = () => {
      window.location.pathname = window.location.pathname.includes("login")
        ? "frontend/pages/register/"
        : "frontend/pages/login/";
    };

    if (
      window.location.pathname.includes("checkout") ||
      window.location.pathname.includes("login") ||
      window.location.pathname.includes("register")
    )
      document.getElementById("nav-search").style.display = "none";
  } else {
    document.getElementById("nav-username").innerText = window.getUsername();
    document.getElementById("nav-auth-button").innerHTML = "Logout";
    document.getElementById("nav-auth-button").onclick = () => {
      window.logout();
      window.location.pathname = "frontend/pages/login/";
    };
    
    if (!validateAdmin()) {
      document.getElementById("nav-username").onclick = () => {
        window.location.pathname = "frontend/pages/history/"
      }
      document.getElementById("nav-add-item").style.display = "none";
    } else {
      document.getElementById("nav-username").onclick = () => {
        window.location.pathname = "frontend/pages/request/"
      }
    }
    document.getElementById("nav-username").style.cursor = "pointer"
    document.getElementById("nav-add-item").className = "plus-btn";
    document.getElementById("nav-add-item").onclick = goToAddVariant;

    if (
      window.location.pathname.includes("checkout") ||
      window.location.pathname.includes("login") ||
      window.location.pathname.includes("register")
    )
      document.getElementById("nav-search").style.display = "none";
  }
};
