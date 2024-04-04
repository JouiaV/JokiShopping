
const navbarElem = document.getElementById("navbar")
const navbarLogoElem = document.getElementById("navbar_icon")
const navbarContentElem = document.getElementById("navbar_content")
const navbarBackdropElem = document.getElementById("navbar-backdrop")

var prevScrollpos = window.pageYOffset;
var isNavbarOpen = false

const navbarContentElemHeight = navbarContentElem.offsetHeight;
navbarContentElem.style.bottom = `-${navbarContentElemHeight}px`


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
    navbarLogoElem.src = "../images/open_navbar_icon.png"
    navbarContentElem.style.bottom = `-${navbarContentElemHeight+100}px`
    isNavbarOpen = false

    navbarBackdropElem.style.width = "0"
    navbarBackdropElem.style.height = "0"
}

function show_navbar_content() {
    navbarLogoElem.src = "../images/close_navbar_icon.png"
    navbarContentElem.style.bottom = "0"
    isNavbarOpen = true

    navbarBackdropElem.style.width = "100%"
    navbarBackdropElem.style.height = "100%"
}


