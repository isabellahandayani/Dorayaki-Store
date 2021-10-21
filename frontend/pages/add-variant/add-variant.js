window.onload = () => {
    setNavbar();
    if(!getCookie("SessionID")) {
        window.location.href = "../login/"
    }
}