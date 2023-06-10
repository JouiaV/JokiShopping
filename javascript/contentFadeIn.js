

// CONTENT FADE IN
var content = document.querySelector("body")

function unfadeContent() {
    var op = 0.1;  // initial opacity
    content.style.display = 'block';
    var timer = setInterval(function () {
        if (op >= 1){
            clearInterval(timer);
        }
        content.style.opacity = op;
        content.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op += op * 0.1; 
    }, 10);
}



