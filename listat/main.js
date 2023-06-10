
import { remove_lista_from_listani } from "../javascript/localStorage_listani.js"

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-app.js"
import { getDatabase, ref, push, set, onValue, remove } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-database.js"


const appSettings = {
    databaseURL: "https://jokishopping-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)

const listaKoodi = localStorage.getItem("current-lista")
const listaNimi = localStorage.getItem("current-lista-nimi")

// Locations in DB
const shoppinglistCheckedInDB_PATH = `lists/${listaKoodi}/checked` 
const shoppinglistCheckedInDB = ref(database, shoppinglistCheckedInDB_PATH)
const shoppinglistUncheckedInDB_PATH = `lists/${listaKoodi}/unchecked`  
const shoppinglistUncheckedInDB = ref(database, shoppinglistUncheckedInDB_PATH)

// const elems
const inputFieldElem = document.querySelector("#input-field")
const addButtonElem = document.querySelector("#add-button")
const shoppingListUncheckedElem = document.querySelector("#shopping-list-unchecked")
const shoppingListCheckedElem = document.querySelector("#shopping-list-checked")
const dropDownListElem = document.querySelector("#drop-down-list")
const listNameElem = document.querySelector("#listan-nimi")
listNameElem.textContent = listaNimi
const poistuListastaElem = document.querySelector("#poistuListasta")
const listaKoodiElem = document.querySelector("#koodi-text")
listaKoodiElem.textContent = `(KOODI: ${listaKoodi})`

// color selector
const redRdElem = document.querySelector("#red")
const orangeRdElem = document.querySelector("#orange")
const yellowRdElem = document.querySelector("#yellow")
const greenRdElem = document.querySelector("#green")
const blueRdElem = document.querySelector("#blue")

const shoppingItemAnimationTime = 150  // milliseconds

addButtonElem.addEventListener("click", add_clicked)
poistuListastaElem.addEventListener("click", poistuListasta)

// Add item triggered
function add_clicked() {
    let inputValue = inputFieldElem.value
    addButtonElem.classList.add("active")
    
    // color pick
    let colorValue;
    if (redRdElem.checked) {colorValue = "red"}
    else if (orangeRdElem.checked) {colorValue = "orange"}
    else if (yellowRdElem.checked) {colorValue = "yellow"}
    else if (greenRdElem.checked) {colorValue = "green"}
    else if (blueRdElem.checked) {colorValue = "blue"}

    inputFieldElem.value = "" 

    window.setTimeout(() => {
        addButtonElem.classList.remove("active")
        if (isInputValid(inputValue)) {
            push(shoppinglistUncheckedInDB, {"value": inputValue, "color": colorValue}) 
        }
    }, 125)
}

// validation check
function isInputValid(input) {
    if (input === "") {
        return false
    }
    for (let i = 0; i < input.length; i++) {
        if (input[i] !== " ") {
            return true
        }
    }
    return false
}

// UNCHECKED value changed listener + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + ++ + + + + + + + + + + + + + + + + +
onValue(shoppinglistUncheckedInDB, function(snapshot) {
    if (!snapshot.exists()) {
        shoppingListUncheckedElem.innerHTML = "<a class='ei_ole_unchecked'>Lista on tyhjä...</a>"
        return
    }
    dropDownListElem.innerHTML = ""
    let itemsArray = Object.entries(snapshot.val())
    itemsArray.reverse()
    shoppingListUncheckedElem.innerHTML = ""

    let redArray = []
    let orangeArray = []
    let yellowArray = []
    let greenArray = []
    let blueArray = []

    for (let i = 0; i < itemsArray.length; i++) {
        let item = itemsArray[i]
        let itemColor = item[1]["color"]
        if (itemColor == "orange") {
            orangeArray.push(item)
        } else if (itemColor == "yellow") {
            yellowArray.push(item)
        } else if (itemColor == "green") {
            greenArray.push(item)
        } else if (itemColor == "blue") {
            blueArray.push(item)
        } else {
            redArray.push(item)
        }
    }

    let orderedArray = redArray.concat(orangeArray, yellowArray, greenArray, blueArray)
    for (let e = 0; e < orderedArray.length; e++) {
        let item = orderedArray[e]
        addNewItemToUncheckedShoppingList(item)
    }
    
})


// CHECKED value changed listener - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
onValue(shoppinglistCheckedInDB, function(snapshot) {
    if (!snapshot.exists()) {
        shoppingListCheckedElem.innerHTML = "<a class='ei_ole_checked'>Ei ole otettuja...</a>"
        return
    }

    let itemsArray = Object.entries(snapshot.val())
    itemsArray.reverse()

    shoppingListCheckedElem.innerHTML = ""

    let redArray = []
    let orangeArray = []
    let yellowArray = []
    let greenArray = []
    let blueArray = []

    for (let i = 0; i < itemsArray.length; i++) {
        let item = itemsArray[i]
        let itemColor = item[1]["color"]
        if (itemColor == "orange") {
            orangeArray.push(item)
        } else if (itemColor == "yellow") {
            yellowArray.push(item)
        } else if (itemColor == "green") {
            greenArray.push(item)
        } else if (itemColor == "blue") {
            blueArray.push(item)
        } else {
            redArray.push(item)
        }
    }

    let orderedArray = redArray.concat(orangeArray, yellowArray, greenArray, blueArray)
    for (let e = 0; e < orderedArray.length; e++) {
        let item = orderedArray[e]
        addNewItemToCheckedShoppingList(item)
    }

})


// ========================================================================================================
// create new UNCHECKED item + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + + +
function addNewItemToUncheckedShoppingList(item) {

    let itemID = item[0]
    let itemValue = item[1]["value"]
    let itemColor = item[1]["color"]

    // Main li elem
    let liElem = document.createElement("li")
    liElem.classList.add(`color-${itemColor}`)
    // liElem.id = itemID

    // List item value
    let textElem = document.createElement("a")
    textElem.textContent = itemValue

    // Check mark button
    let checkMarkElem = document.createElement("span")
    checkMarkElem.textContent = "✓"  // ✓, ✔
    checkMarkElem.classList.add("check_mark")
    checkMarkElem.classList.add(`color-${itemColor}`)

    // Dropdown trigger
    let dropdownElem = document.createElement("div")
    dropdownElem.classList.add("dropdown")

    // Dropdown content
    let dropdownContentElem = document.createElement("form")
    function handleForm(event) { event.preventDefault(); } 
    dropdownContentElem.addEventListener('submit', handleForm);
    dropdownContentElem.classList.add("dropdown-content")
    dropdownContentElem.classList.add(itemID)
    dropdownContentElem.classList.add("hidden")

    // Dropdown backdrop
    let backdropElem = document.createElement("div")
    backdropElem.classList.add("dropdown-backdrop")
    backdropElem.classList.add("hidden")
    
    // EDIT BOX CONTENT < < < < < < < < < < < < < < < < < < < < < < < < < < < < < < < < < < < < < < < < < < < <
    // Muokkaa text
    let muokaaTextElem = document.createElement("p")
    muokaaTextElem.classList.add("muokkaa-p")
    muokaaTextElem.textContent = "Muokkaa: " + itemValue

    // Dropdown colorpicker  
    let colorPickerElem = document.createElement("div")
    colorPickerElem.classList.add("color-picker")

    // red
    let redLabelElem = document.createElement("label")
    redLabelElem.classList.add("rd")
    let redRadioElem = document.createElement("input")
    redRadioElem.type = "radio"
    redRadioElem.autocomplete = "off"
    redRadioElem.name = "dp_color-picker"
    redRadioElem.id = "dp_red" + itemID
    let redCircleElem = document.createElement("div")
    redCircleElem.classList.add("red")
    redLabelElem.appendChild(redRadioElem)
    redLabelElem.appendChild(redCircleElem)

    // orange
    let orangeLabelElem = document.createElement("label")
    orangeLabelElem.classList.add("rd")
    let orangeRadioElem = document.createElement("input")
    orangeRadioElem.type = "radio"
    orangeRadioElem.autocomplete = "off"
    orangeRadioElem.name = "dp_color-picker"
    orangeRadioElem.id = "dp_orange" + itemID
    let orangeCircleElem = document.createElement("div")
    orangeCircleElem.classList.add("orange")
    orangeLabelElem.appendChild(orangeRadioElem)
    orangeLabelElem.appendChild(orangeCircleElem)

    // yellow
    let yellowLabelElem = document.createElement("label")
    yellowLabelElem.classList.add("rd")
    let yellowRadioElem = document.createElement("input")
    yellowRadioElem.type = "radio"
    yellowRadioElem.autocomplete = "off"
    yellowRadioElem.name = "dp_color-picker"
    yellowRadioElem.id = "dp_yellow" + itemID
    let yellowCircleElem = document.createElement("div")
    yellowCircleElem.classList.add("yellow")
    yellowLabelElem.appendChild(yellowRadioElem)
    yellowLabelElem.appendChild(yellowCircleElem)

    // green
    let greenLabelElem = document.createElement("label")
    greenLabelElem.classList.add("rd")
    let greenRadioElem = document.createElement("input")
    greenRadioElem.type = "radio"
    greenRadioElem.autocomplete = "off"
    greenRadioElem.name = "dp_color-picker"
    greenRadioElem.id = "dp_green" + itemID
    let greenCircleElem = document.createElement("div")
    greenCircleElem.classList.add("green")
    greenLabelElem.appendChild(greenRadioElem)
    greenLabelElem.appendChild(greenCircleElem)

    // blue
    let blueLabelElem = document.createElement("label")
    blueLabelElem.classList.add("rd")
    let blueRadioElem = document.createElement("input")
    blueRadioElem.type = "radio"
    blueRadioElem.autocomplete = "off"
    blueRadioElem.name = "dp_color-picker"
    blueRadioElem.id = "dp_blue" + itemID
    let blueCircleElem = document.createElement("div")
    blueCircleElem.classList.add("blue")
    blueLabelElem.appendChild(blueRadioElem)
    blueLabelElem.appendChild(blueCircleElem)
    
    // Append color options
    colorPickerElem.appendChild(redLabelElem)
    colorPickerElem.appendChild(orangeLabelElem)
    colorPickerElem.appendChild(yellowLabelElem)
    colorPickerElem.appendChild(greenLabelElem)
    colorPickerElem.appendChild(blueLabelElem)

    // Dropdown input edit value elem
    let editValueInputElem = document.createElement("input")
    editValueInputElem.classList.add("editValueInput")
    editValueInputElem.id = "editValueInput" + itemID // autocomplete="off"
    editValueInputElem.autocomplete = "off"
    editValueInputElem.type = "text"
    editValueInputElem.placeholder = "nimeä uudelleen..."
    editValueInputElem.value = itemValue

    // Dropdown button save value elem
    let saveValueBtnElem = document.createElement("button")
    saveValueBtnElem.classList.add("saveValueBtn")
    saveValueBtnElem.textContent = "Tallenna"

    // Span exit EDIT button
    let exitEditBtn = document.createElement("span")
    exitEditBtn.classList.add("exitEditBtn")
    exitEditBtn.textContent = "x"


    // EVENT LISTENERS
    // On checkmark click - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
    checkMarkElem.addEventListener("click", function() {
        checkMarkElem.classList.add("active")
        liElem.classList.add("active")
        window.setTimeout(() => {
            let exactLocationOfItemInDB = ref(database, `${shoppinglistUncheckedInDB_PATH}/${itemID}`)
            remove(exactLocationOfItemInDB)
            push(shoppinglistCheckedInDB, {"value": itemValue, "color": itemColor})
        }, shoppingItemAnimationTime);
    })
    
    // OPEN EDIT Dropdown editor triggered - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
    dropdownElem.addEventListener("click", function () {
        editValueInputElem.value = itemValue
        liElem.classList.add("active")
        backdropElem.classList.remove("hidden")
        dropdownContentElem.classList.remove("hidden")
        
        if (itemColor === "red") {redRadioElem.checked = true}
        else if (itemColor === "orange") {orangeRadioElem.checked = true}
        else if (itemColor === "yellow") {yellowRadioElem.checked = true}
        else if (itemColor === "green") {greenRadioElem.checked = true}
        else if (itemColor === "blue") {blueRadioElem.checked = true}
    })

    // EXIT EDIT dropdown editor triggered - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
    exitEditBtn.addEventListener("click", function () {
        dropdownContentElem.classList.add("hidden")
        backdropElem.classList.add("hidden")
        liElem.classList.remove("active")
    })
    backdropElem.addEventListener("click", function () {
        dropdownContentElem.classList.add("hidden")
        backdropElem.classList.add("hidden")
        liElem.classList.remove("active")
    })

    // SAVE EDIT dropdown triggered - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
    saveValueBtnElem.addEventListener("click", function () {
        // item value
        let newValue = editValueInputElem.value
        if (!isInputValid(newValue)) {return}
        let newColor = null;
        
        if (redRadioElem.checked) {newColor = "red"}
        else if (orangeRadioElem.checked) {newColor = "orange"}
        else if (yellowRadioElem.checked) {newColor = "yellow"}
        else if (greenRadioElem.checked) {newColor = "green"}
        else if (blueRadioElem.checked) {newColor = "blue"}

        let exactLocationOfItemInDB = ref(database, `${shoppinglistUncheckedInDB_PATH}/${itemID}`)
        if (newColor === null) {
            set(exactLocationOfItemInDB, {"value": newValue, "color": itemColor})
        } else {
            liElem.setAttribute = ("color", itemColor)
            set(exactLocationOfItemInDB, {"value": newValue, "color": newColor})
        }
        dropdownContentElem.classList.add("hidden")
        backdropElem.classList.add("hidden")
        liElem.classList.remove("active")
    })

    // Adding the element to ul main list
    dropdownContentElem.appendChild(exitEditBtn)
    dropdownContentElem.appendChild(muokaaTextElem)
    dropdownContentElem.appendChild(colorPickerElem)
    dropdownContentElem.appendChild(editValueInputElem)
    dropdownContentElem.appendChild(saveValueBtnElem)
    dropDownListElem.appendChild(dropdownContentElem)
    dropDownListElem.appendChild(backdropElem)
    liElem.appendChild(checkMarkElem)
    dropdownElem.appendChild(textElem)
    liElem.appendChild(dropdownElem)
    shoppingListUncheckedElem.appendChild(liElem)
}


// =========================================================================================================================================
// Create new CHECKED item - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
function addNewItemToCheckedShoppingList(item) {

    let itemID = item[0]
    let itemValue = item[1]["value"]
    let itemColor = item[1]["color"]

    // Main li elem
    let newLiElem = document.createElement("li")
    newLiElem.id = itemID
    newLiElem.classList.add(`color-${itemColor}`)

    // Remove button elem
    let newSpanRemoveElem = document.createElement("span")
    newSpanRemoveElem.textContent = "x"
    newSpanRemoveElem.classList.add("remove_mark")
    newSpanRemoveElem.classList.add(`color-${itemColor}`)

    // Text value of item
    let newTextElem = document.createElement("a")
    newTextElem.textContent = itemValue

    // Remove item triggered - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
    newSpanRemoveElem.addEventListener("click", function() {
        newLiElem.classList.add("active")
        newSpanRemoveElem.classList.add("active")
        window.setTimeout(() => {
            let exactLocationOfItemInDB = ref(database, `${shoppinglistCheckedInDB_PATH}/${itemID}`)
            remove(exactLocationOfItemInDB)
        }, shoppingItemAnimationTime);
    })

    // Uncheck item triggered - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
    newTextElem.addEventListener("click", function() {
        newLiElem.classList.add("active")
        window.setTimeout(() => {
            let exactLocationOfItemInDB = ref(database, `${shoppinglistCheckedInDB_PATH}/${itemID}`)
            remove(exactLocationOfItemInDB)
            push(shoppinglistUncheckedInDB, {"value": itemValue, "color": itemColor})
        }, shoppingItemAnimationTime);
    })

    // Adding the element to ul main list
    newLiElem.appendChild(newSpanRemoveElem)
    newLiElem.appendChild(newTextElem)
    shoppingListCheckedElem.appendChild(newLiElem)
}

function poistuListasta() {
    remove_lista_from_listani(listaKoodi)
    window.location.href = '../index.html';
}



