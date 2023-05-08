
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-database.js"


const appSettings = {
    databaseURL: "https://jokishopping-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const shoppinglistCheckedInDB = ref(database, "shoppingList/checked")
const shoppinglistUncheckedInDB = ref(database, "shoppingList/unchecked")

const inputFieldElem = document.querySelector("#input-field")
const addButtonElem = document.querySelector("#add-button")
const shoppingListUncheckedElem = document.querySelector("#shopping-list-unchecked")
const shoppingListCheckedElem = document.querySelector("#shopping-list-checked")

const shoppingItemAnimationTime = 200  // milliseconds

addButtonElem.addEventListener("click", add_clicked)

function add_clicked() {
    let inputValue = inputFieldElem.value

    if (isInputValid(inputValue)) {
        push(shoppinglistUncheckedInDB, inputValue)
    }
    inputFieldElem.value = ""
}

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

// UNCHECKED + + + + + + + + + + + + + + + + + +
onValue(shoppinglistUncheckedInDB, function(snapshot) {
    if (!snapshot.exists()) {
        console.log("Ei ole mitään unchecked")
        shoppingListUncheckedElem.innerHTML = "Lista on tyhjä..."
        return
    }

    let itemsArray = Object.entries(snapshot.val())
    itemsArray.reverse()

    console.log("unchecked:")
    console.log(itemsArray)
    shoppingListUncheckedElem.innerHTML = ""

    for (let i = 0; i < itemsArray.length; i++) {
        let item = itemsArray[i]
        addNewItemToUncheckedShoppingList(item)
    }
})


// CHECKED - - - - - - - - - - - - - - - - - - - - - 
onValue(shoppinglistCheckedInDB, function(snapshot) {
    if (!snapshot.exists()) {
        console.log("Ei ole mitään checked")
        shoppingListCheckedElem.innerHTML = "Ei ole otettuja ruokia..."
        return
    }

    let itemsArray = Object.entries(snapshot.val())
    itemsArray.reverse()

    console.log("Checked:")
    console.log(itemsArray)
    shoppingListCheckedElem.innerHTML = ""

    for (let i = 0; i < itemsArray.length; i++) {
        let item = itemsArray[i]
        addNewItemToCheckedShoppingList(item)
    }
})


// UNCHECKED + + + + + + + + + + + + + + + + + +
function addNewItemToUncheckedShoppingList(item) {
    let itemID = item[0]
    let itemValue = item[1]

    let liElem = document.createElement("li")
    liElem.id = itemID

    let checkMarkElem = document.createElement("span")
    checkMarkElem.textContent = "✓"  // ✓, ✔
    checkMarkElem.classList += "check_mark"

    let dropdownElem = document.createElement("div")
    dropdownElem.classList += "dropdown"

    let dropdownContentElem = document.createElement("div")
    dropdownContentElem.classList += " dropdown-content"
    dropdownContentElem.classList += " hidden"
    
    let testPElem = document.createElement("p")
    testPElem.textContent = "moikka, tämä on testi"

    let textElem = document.createElement("a")
    textElem.textContent = itemValue

    checkMarkElem.addEventListener("click", function() {
        window.setTimeout(() => {
            let exactLocationOfItemInDB = ref(database, `shoppingList/unchecked/${itemID}`)
            remove(exactLocationOfItemInDB)
            push(shoppinglistCheckedInDB, itemValue)
        }, shoppingItemAnimationTime);
    })
    
    dropdownElem.addEventListener("click", function () {
        // dropdownContentElem.classList.remove("hidden")
        console.log("dp")
    })

    dropdownContentElem.addEventListener("click", function () {
        dropdownContentElem.classList += " hidden"
    })

    dropdownContentElem.append(testPElem)
    dropdownElem.append(dropdownContentElem)
    liElem.append(checkMarkElem)
    dropdownElem.append(textElem)
    liElem.append(dropdownElem)
    shoppingListUncheckedElem.append(liElem)
}


// CHECKED - - - - - - - - - - - - - - - - - - - - - 
function addNewItemToCheckedShoppingList(item) {

    let itemID = item[0]
    let itemValue = item[1]

    let newLiElem = document.createElement("li")
    newLiElem.id = itemID

    let newSpanRemoveElem = document.createElement("span")
    newSpanRemoveElem.textContent = "x"
    newSpanRemoveElem.classList += "remove_mark"

    let newTextElem = document.createElement("a")
    newTextElem.textContent = itemValue

    newSpanRemoveElem.addEventListener("click", function() {
        window.setTimeout(() => {
            let exactLocationOfItemInDB = ref(database, `shoppingList/checked/${itemID}`)
            remove(exactLocationOfItemInDB)
        }, shoppingItemAnimationTime);
    })

    newTextElem.addEventListener("click", function() {
        window.setTimeout(() => {
            let exactLocationOfItemInDB = ref(database, `shoppingList/checked/${itemID}`)
            remove(exactLocationOfItemInDB)
            push(shoppinglistUncheckedInDB, itemValue)
        }, shoppingItemAnimationTime);
    })

    newLiElem.append(newSpanRemoveElem)
    newLiElem.append(newTextElem)
    shoppingListCheckedElem.append(newLiElem)
}

