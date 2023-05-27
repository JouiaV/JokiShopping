
const isNavbarOpen = false

// SHOW NAVABR ON BOTTOM WHEN SCROLL UP
const navbarElem = document.getElementById("navbar")
var prevScrollpos = window.pageYOffset;

window.onscroll = function() {
    if (isNavbarOpen) {return}
    var currentScrollPos = window.pageYOffset;
    if (prevScrollpos > currentScrollPos) {
        navbarElem.style.bottom = "0";
    } else {
        navbarElem.style.bottom = "-80px";
    }
    prevScrollpos = currentScrollPos;
}


