window.onload = () => {
    setNavbar();
    if(!getCookie("sessionID")) {
        window.location.href = "../login/"
    }
}