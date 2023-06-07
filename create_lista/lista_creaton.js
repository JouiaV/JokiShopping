import { initializeApp } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-app.js"
import { getDatabase, ref, get, update } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-database.js"

import { add_lista_to_listani } from "../javascript/localStorage_listani.js"

const appSettings = {
    databaseURL: "https://jokishopping-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)

const listanNimiInputElem = document.getElementById("listan_nimi_input")
const listanKoodiInputElem = document.getElementById("listan_koodi_input")
const luoListaButtonElem = document.getElementById("createButton")
const errorMsgElem = document.getElementById("error_msg")

luoListaButtonElem.addEventListener("click", luoPainettu)

async function luoPainettu() {
    errorMsgElem.textContent = ""
    let nimi = listanNimiInputElem.value
    let koodi = listanKoodiInputElem.value

    if (!validate(nimi, koodi)) {
        errorMsgElem.textContent = "Varmista, että kaikki kohdat täytetty, sekä, että koodissa ei ole välilyöntejä"
        return
    }
    else if (koodi.length !== 5) {
        errorMsgElem.textContent = "Koodin täytyy olla tasan 5 merkkiä pitkä"
        return
    }
    else if (await is_code_in_use(koodi)) {
        errorMsgElem.textContent = "Sorge koodi on jo käytössä..."
        return
    }

    console.log("Luodaan lista")
    create_lista(nimi, koodi)
}

function validate(nimi, koodi) {
    if (is_empty(nimi) || is_empty(koodi) || has_space(koodi)) {
        return false
    }
    return true
}

function is_empty(inp) {
    if (inp === "") {return true}
    for (let i = 0; i < inp.length; i++) {
        if (inp[i] !== " ") {
            return false
        }
    }
    return true
}

function has_space(inp) {
    for (let i = 0; i < inp.length; i++) {
        if (inp[i] === " ") {
            return true
        }
    }
}

async function is_code_in_use(koodi) {
    const listInDB = ref(database, `lists/${koodi}`)
    var out;
    await get(listInDB).then((snapshot) => {
            if (snapshot.exists()) {
                out = true
            } else {
                out =  false
            }
        }).catch((error) => {
                console.error(error);
        });

    return out
}

// CREATE LISTA
function create_lista(nimi, koodi) {
    update(ref(database, `lists/${koodi}/settings`), {"name": nimi})
    add_lista_to_listani(nimi, koodi)
    window.location.href = '../index.html';
}


