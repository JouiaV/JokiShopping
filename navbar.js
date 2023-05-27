
const navbarElem = document.getElementById("navbar")
var prevScrollpos = window.pageYOffset;

var isNavbarOpen = false
const navbarContentElem = document.getElementById("navbar_content")


// SHOW NAVABR ON BOTTOM WHEN SCROLL UP

window.onscroll = function() {
    if (isNavbarOpen) {
        hide_navbar_content()
    }
    var currentScrollPos = window.pageYOffset;
    if (prevScrollpos > currentScrollPos) {
        navbarElem.style.bottom = "0";
    } else {
        navbarElem.style.bottom = "-80px";
    }
    prevScrollpos = currentScrollPos;
}


// NAVBAR CONTENT

navbarElem.addEventListener("click", () => {
    if (isNavbarOpen) {
        hide_navbar_content()
    }
    else if (!isNavbarOpen) {
        show_navbar_content()
    }
})

function hide_navbar_content() {
    navbarContentElem.style.bottom = "-210px"
    isNavbarOpen = false
}

function show_navbar_content() {
    navbarContentElem.style.bottom = "50px"
    isNavbarOpen = true
}


