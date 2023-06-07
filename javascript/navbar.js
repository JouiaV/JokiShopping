
const navbarElem = document.getElementById("navbar")
const navbarContentElem = document.getElementById("navbar_content")
const navbarBackdropElem = document.getElementById("navbar-backdrop")

var prevScrollpos = window.pageYOffset;
var isNavbarOpen = false

const navbarContentElemHeight = navbarContentElem.offsetHeight;
navbarContentElem.style.bottom = `-${navbarContentElemHeight}px`


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

navbarBackdropElem.addEventListener("click", () => {
    if (isNavbarOpen) {
        hide_navbar_content()
    }
})

navbarElem.addEventListener("click", () => {
    if (isNavbarOpen) {
        hide_navbar_content()
    }
    else if (!isNavbarOpen) {
        show_navbar_content()
    }
})

function hide_navbar_content() {
    navbarContentElem.style.bottom = `-${navbarContentElemHeight}px`
    isNavbarOpen = false

    navbarBackdropElem.style.width = "0"
    navbarBackdropElem.style.height = "0"
}

function show_navbar_content() {
    navbarContentElem.style.bottom = "50px"
    isNavbarOpen = true

    navbarBackdropElem.style.width = "100%"
    navbarBackdropElem.style.height = "100%"
}


