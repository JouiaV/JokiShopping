
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-app.js"
import { getDatabase, ref, push, set, onValue, remove } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-database.js"


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
const dropDownListElem = document.querySelector("#drop-down-list")

const shoppingItemAnimationTime = 150  // milliseconds

addButtonElem.addEventListener("click", add_clicked)

function add_clicked() {
    let inputValue = inputFieldElem.value
    addButtonElem.classList += " active" 
    window.setTimeout(() => {
        addButtonElem.classList -= " active"
        if (isInputValid(inputValue)) {
            push(shoppinglistUncheckedInDB, inputValue)
            inputFieldElem.value = ""
        }
    }, 125)
    
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
        shoppingListUncheckedElem.innerHTML = "<a class='ei_ole_unchecked'>Lista on tyhjä...</a>"
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
        shoppingListCheckedElem.innerHTML = "<a class='ei_ole_checked'>Ei ole otettuja...</a>"
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


// ========================================================================================================
// UNCHECKED + + + + + + + + + + + + + + + + + +
function addNewItemToUncheckedShoppingList(item) {
    let itemID = item[0]
    let itemValue = item[1]

    // Main li elem
    let liElem = document.createElement("li")
    liElem.id = itemID

    // List item value
    let textElem = document.createElement("a")
    textElem.textContent = itemValue

    // Check mark button
    let checkMarkElem = document.createElement("span")
    checkMarkElem.textContent = "✓"  // ✓, ✔
    checkMarkElem.classList.add("check_mark")

    // Dropdown trigger
    let dropdownElem = document.createElement("div")
    dropdownElem.classList.add("dropdown")

    // Dropdown content
    let dropdownContentElem = document.createElement("div")
    dropdownContentElem.classList.add("dropdown-content")
    dropdownContentElem.classList.add("hidden")
    
    // test
    let testPElem = document.createElement("p")
    testPElem.classList.add("muokkaa-p")
    testPElem.textContent = "Muokkaa: " + itemValue

    // Dropdown input edit value elem
    let editValueInputElem = document.createElement("input")
    editValueInputElem.classList.add("editValueInput")
    editValueInputElem.type = "text"
    editValueInputElem.placeholder = "kirjoita ruoka"
    editValueInputElem.value = itemValue

    // Dropdown button save value elem
    let saveValueBtnElem = document.createElement("button")
    saveValueBtnElem.classList.add("saveValueBtn")
    saveValueBtnElem.textContent = "Tallenna"

    // Span exit button
    let exitEditBtn = document.createElement("span")
    exitEditBtn.classList.add("exitEditBtn")
    exitEditBtn.textContent = "x"

    // On checkmark click - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
    checkMarkElem.addEventListener("click", function() {
        checkMarkElem.classList.add("active")
        liElem.classList.add("active")
        window.setTimeout(() => {
            let exactLocationOfItemInDB = ref(database, `shoppingList/unchecked/${itemID}`)
            remove(exactLocationOfItemInDB)
            push(shoppinglistCheckedInDB, itemValue)
        }, shoppingItemAnimationTime);
    })
    
    // Dropdown triggerred - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
    dropdownElem.addEventListener("click", function () {
        liElem.classList.add("active")
        dropdownContentElem.classList.remove("hidden")
        console.log("editor open")
    })

    // Exit dropdown triggered - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
    exitEditBtn.addEventListener("click", function () {
        dropdownContentElem.classList.add("hidden")
        liElem.classList.remove("active")
    })

    // Save dropdown triggered - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
    saveValueBtnElem.addEventListener("click", function () {
        let exactLocationOfItemInDB = ref(database, `shoppingList/unchecked/${itemID}`)
        set(exactLocationOfItemInDB, editValueInputElem.value)
        dropdownContentElem.classList.add("hidden")
        liElem.classList.remove("active")
    })

    dropdownContentElem.append(exitEditBtn)
    dropdownContentElem.append(testPElem)
    dropdownContentElem.append(editValueInputElem)
    dropdownContentElem.append(saveValueBtnElem)
    dropDownListElem.append(dropdownContentElem)
    liElem.append(checkMarkElem)
    dropdownElem.append(textElem)
    liElem.append(dropdownElem)
    shoppingListUncheckedElem.append(liElem)
}


// ========================================================================================================
// CHECKED - - - - - - - - - - - - - - - - - - - - - 
function addNewItemToCheckedShoppingList(item) {

    let itemID = item[0]
    let itemValue = item[1]

    let newLiElem = document.createElement("li")
    newLiElem.id = itemID

    let newSpanRemoveElem = document.createElement("span")
    newSpanRemoveElem.textContent = "x"
    newSpanRemoveElem.classList.add("remove_mark")

    let newTextElem = document.createElement("a")
    newTextElem.textContent = itemValue

    newSpanRemoveElem.addEventListener("click", function() {
        newLiElem.classList.add("active")
        newSpanRemoveElem.classList.add("active")
        window.setTimeout(() => {
            let exactLocationOfItemInDB = ref(database, `shoppingList/checked/${itemID}`)
            remove(exactLocationOfItemInDB)
        }, shoppingItemAnimationTime);
    })

    newTextElem.addEventListener("click", function() {
        newLiElem.classList.add("active")
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


const notifyBtnElem = document.querySelector("#notify")
notifyBtnElem.addEventListener("click", notifyMe)

// testi
function notifyMe() {
    if (!("Notification" in window)) {
      // Check if the browser supports notifications
      alert("This browser does not support desktop notification");
    } else if (Notification.permission === "granted") {
      // Check whether notification permissions have already been granted;
      // if so, create a notification
      const notification = new Notification("Hi there!");
      // …
    } else if (Notification.permission !== "denied") {
      // We need to ask the user for permission
      Notification.requestPermission().then((permission) => {
        // If the user accepts, let's create a notification
        if (permission === "granted") {
          const notification = new Notification("Hi there!");
          // …
        }
      });
    }
  
    // At last, if the user has denied notifications, and you
    // want to be respectful there is no need to bother them anymore.
  }
