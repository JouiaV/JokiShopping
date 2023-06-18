
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-app.js"
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-database.js"

import { get_listani, add_lista_to_listani } from "./localStorage_listani.js";


const appSettings = {
    databaseURL: "https://jokishopping-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)

const listaniElem = document.getElementById("listani-lista")
const liityInputElem = document.getElementById("listan_koodi_input")
const liityButtonElem = document.getElementById("liityButton")
const errorMsgElem = document.getElementById("error-msg")
const luoButtonElem = document.getElementById("luoButton")

liityButtonElem.addEventListener("click", liity_listaan)
luoButtonElem.addEventListener("click", open_luoLista)

var listani
update_listani()


// update listani lista - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

function update_listani() {
    listaniElem.innerHTML = ""

    listani = get_listani()

    for (let i = 0; i < listani.length; i++) {

        let lista = listani[i]
        let nimi = lista["name"]
        let koodi = lista["code"]

        let listaElem = document.createElement("div")
        listaElem.classList += "lista"
        listaElem.id = koodi
        listaElem.textContent = nimi

        // ON CLICK
        listaElem.addEventListener("click", function () {
            listaElem.classList.add("active")
            localStorage.setItem("current-lista", koodi)
            localStorage.setItem("current-lista-nimi", nimi)
            window.location.href = './listat/lista.html';
        })

        listaniElem.appendChild(listaElem)
    }

    if (listani.length === 0) {
        listaniElem.textContent = "Sinulla ei ole vielä listoja listättynä tai tehtynä."
    }
}

// LIITY LISTAAN - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
async function liity_listaan() {
    errorMsgElem.textContent = ""
    
    let koodi = liityInputElem.value

    if (koodi === "") {
        errorMsgElem.textContent = "Ei löytynyt listaa kyseisellä koodilla."
        return
    }
    else if (is_already_joined_to_lista(koodi)) {
        errorMsgElem.textContent = "Olet jo liittyneenä kyseiseen listaan."
        return
    }

    var data = await get_lista(koodi)

    if (data.exists()) {
        const val = data.val()

        add_lista_to_listani(val["settings"]["name"], koodi)

        liityInputElem.value = ""

        update_listani()

    } else {
        errorMsgElem.textContent = "Ei löytynyt listaa kyseisellä koodilla."
    }
}

// GET lista info - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
async function get_lista(koodi) {
    const listInDB = ref(database, `lists/${koodi}`)
    var data
    await get(listInDB).then((snapshot) => {
            data = snapshot
        }).catch((error) => {
                console.error(error);
        });

    return data
}

// Is already joined to a lista - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
function is_already_joined_to_lista(koodi) {
    let listani = get_listani()

    for (let i = 0; i < listani.length; i++) {
        let lista = listani[i]
        let listaKoodi  = lista["code"]
        
        if (listaKoodi === koodi) {
            return true
        }
    }
    return false
}

// Open luo lista page - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
function open_luoLista() {
    window.location.href = './create_lista/lista_creation.html';
}

