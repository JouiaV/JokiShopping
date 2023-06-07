// add_lista_to_listani("testi nimi jea", "koodi")
// add_lista_to_listani("Tosi pitkä nimi mutta erikseen testissä tänään jea lets mennään", "letsm")
// add_lista_to_listani("Pitkänimimutyhteenkatottaanmittapaahtuusaakyllänähdämitä", "mitä0")
// add_lista_to_listani("Tavallinen ruokalista", "00001")


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

liityButtonElem.addEventListener("click", liity_listaan)

var listani
update_listani()

function update_listani() {
    listaniElem.innerHTML = ""

    listani = get_listani()
    console.log(listani)

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
            console.log(koodi)
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

async function liity_listaan() {
    errorMsgElem.textContent = ""
    console.log("Etsitään listaa")
    
    let koodi = liityInputElem.value

    if (koodi === "") {
        errorMsgElem.textContent = "Ei löytynyt listaa kyseisellä koodilla."
        return
    }

    var data = await get_lista(koodi)

    if (data.exists()) {
        console.log("liitytään listaan:")
        const val = data.val()
        console.log(val)
        console.log(val["settings"]["name"])

        add_lista_to_listani(val["settings"]["name"], koodi)

        liityInputElem.value = ""

        update_listani()

    } else {
        errorMsgElem.textContent = "Ei löytynyt listaa kyseisellä koodilla."
    }
}

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
