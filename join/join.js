
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-app.js"
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-database.js"

import { get_listani, add_lista_to_listani } from "../javascript/localStorage_listani.js";


const appSettings = {
    databaseURL: "https://jokishopping-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)

const errorMsgElem = document.getElementById("error-msg")

const queryString = window.location.search;
console.log(queryString);
const urlParams = new URLSearchParams(queryString);
const koodi = urlParams.get('koodi')
update_listani(koodi)

// update listani lista - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

async function update_listani(koodi) {
    if (koodi === "" || koodi === null) {
        errorMsgElem.textContent = `Ei löytynyt listaa kyseisellä koodilla: ${koodi}`
        return
    }

    var data = await get_lista(koodi);

    if (!data.exists()) {
        errorMsgElem.textContent = "Ei löytynyt listaa kyseisellä koodilla."
        return
    }

    const val = data.val()
    const nimi = val["settings"]["name"]

    if (!is_already_joined_to_lista(koodi)) {
        add_lista_to_listani(nimi, koodi)
    }

    localStorage.setItem("current-lista", koodi)
    localStorage.setItem("current-lista-nimi", nimi)
    window.location.href = './listat/lista.html';

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


