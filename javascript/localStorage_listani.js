

export function get_listani() {
    let listani_string = localStorage.getItem("listani")

    if (listani_string !== null) {
        var listaniObj = JSON.parse(listani_string)
        return listaniObj
    } 
    else {
        return []
    }
}

export function add_lista_to_listani(nimi, koodi) {
    let listani_string = localStorage.getItem("listani")

    if (listani_string !== null) {
        var listaniObj = JSON.parse(listani_string)
        listaniObj.push({'name': nimi, 'code': koodi})
        localStorage.setItem("listani", JSON.stringify(listaniObj));
    } 
    else {
        localStorage.setItem("listani", JSON.stringify([{'name': nimi, 'code': koodi}]));
    }

}

export function remove_lista_from_listani(koodi) {
    let listani_string = localStorage.getItem("listani")

    if (listani_string === null) {return}

    var listaniObj = JSON.parse(listani_string)
    for (let i = 0; i < listaniObj.length; i++) {
        let lista = listaniObj[i]
        let listaKoodi = lista["code"]

        if (listaKoodi === koodi) {
            listaniObj.splice(i, 1)
            break
        }
    }
    localStorage.setItem("listani", JSON.stringify(listaniObj));
}

