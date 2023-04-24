
const searchBtns = document.getElementsByClassName('button searchBtn')
const inputPlane = document.getElementById('inputPlane')
const inputWatch = document.getElementById('inputWatch')

const planeBtn = document.getElementById('btnPlane')
const watchBtn = document.getElementById('btnWatch')

const plane = document.getElementById('plane')
const watch = document.getElementById('watch')

const cardsPlane = document.getElementById('cardsPlane')
const cardsWatch = document.getElementById('cardsWatch')

const addBtnPlane = document.getElementById('addBtnPlane')

const url = 'https://b273-212-58-102-215.ngrok-free.app'

//кнопка для отмены изменений
//по потери фокуса в инпуте, возврат к первоначальному значению
//подумать над тем, если ввод без года

function createObj(nameMovie, year){
    let obj = {
        "movie_name": nameMovie,
        "year": year,
        "is_seen": false
    }
    return obj
}

//передавать в виде строки
function createCard(name, year, id, checked){
    return `
    <button class="button ${checked}" name="${id}"></button> 
    <div class="edit" style="display: none">
        <input type="text" class="editInput" name=${id}>
        <button class="button btnEditInput" id="${id}"></button>
        <button class="button btnCancelInput"></button>
    </div>
    <span>${name}, ${year}</span>
    <button class="button editBtn" name="${id}"></button>
    <button class="button deleteBtn" name="${id}"></button>
    `
}

function editMovie(){
    //изменение флажка и изменение в виде кнопки
    //появление инпута и кнопок. скрытие предыдущих кнопок
    //ввод, завершение процесса при помощи кнопки btnEditInput
    //по потери фокуса инпут исчезает??(потом)

    //при нажатии на кнопку крестика, данные не сохранаются и не отправляются, остаются преждними. инпут уходит, возвращается обратно надпись с соотв кнопками

    const id = this.name
    const parent = this.parentElement
    const text = parent.querySelector('span')
    const editInput = document.querySelector(`input[name="${id}"`)
    const btns = document.querySelectorAll(`button[name="${id}"]`)
    for(let i = 0; i < btns.length; i++){
        btns[i].style.display = 'none'
    }
    const parentEditInput = editInput.parentElement
    parentEditInput.style.display = 'block'
    editInput.value = text.innerHTML.trim()
    text.innerHTML = ''
    
    const btnEditInput = document.getElementById(`${id}`)
    btnEditInput.addEventListener('click', function(){
        const id = this.id  
        const inputValue = editInput.value
        const inputValueSplited = inputValue.split(', ')
        async function editMovie(id){
            const response = await request(`${url}/movie/${id}`, 'PATCH', createObj(inputValueSplited[0], inputValueSplited[1]))
            if(response.status == 200){
                for(let i = 0; i < btns.length; i++){
                    btns[i].style.display = 'inline-block'
                }
                parent.style.display = 'block'
                parentEditInput.style.display = 'none'
                text.innerHTML = inputValue
            }
        }
        editMovie(id)
    })
}
async function request(url, method,  body = {}){
    console.log(method, url, body)
    if(method == 'GET'){
        const response = await fetch(`${url}`, {
            method: method,
            headers: new Headers({"ngrok-skip-browser-warning": "69420"})
        }) 
        return response
    } else{
        const response = await fetch(`${url}`, {
        method: method,
        headers: new Headers({
            "ngrok-skip-browser-warning": "69420",
            'Content-Type' : 'application/json'
        }),
        body: JSON.stringify(body)
    }) 
    return response}
}
        
function editOnCheckedMovie(){
    console.log(this.name)
    const id = this.name
    const button = this
    async function checkedMovie(id){
        const response = await request(`${url}/movie/${id}`, 'PATCH', {"is_seen": true})

        if(response.status == 200){
            button.className = 'button checkBtn'
            setTimeout(() => {
                button.parentElement.remove()
                const clonedElement = button.parentElement.cloneNode(true);
                cardsWatch.appendChild(clonedElement);
            }, 1000)
        }
    }
    checkedMovie(id)
}

function editOnUncheckedMovie(){
    const id = this.name
    const button = this
    async function unCheckedMovie(id){
        const response = await request(`${url}/movie/${id}`, 'PATCH', {"is_seen": false})

        if(response.status == 200){
            button.className = 'button uncheckBtn'
            setTimeout(() => {
                button.parentElement.remove()
                const clonedElement = button.parentElement.cloneNode(true);
                cardsPlane.appendChild(clonedElement);
            }, 1000)
        }
    }
    unCheckedMovie(id)
}

function deleteMovie(){
    const parent = this.parentElement
    async function deleteMovie(id){
        const response = await request(`${url}/movie/${id}`, 'DELETE')
        if(response.status == 204){
            parent.remove()
        } else{
            console.error('error')
        }
    }
    deleteMovie(this.name)
}

function eventForDeleteBtns(btns){
    for(let i = 0; i < btns.length; i++){
        btns[i].addEventListener('click', deleteMovie)
    }
}

function eventForEditBtns(btns){
    for(let i = 0; i < btns.length; i++){
        btns[i].addEventListener('click', editMovie)
    }
}

function eventForCheckBtns(btns){
    for(let i = 0; i < btns.length; i++){
        btns[i].addEventListener('click', editOnUncheckedMovie)
    }
}

function eventForUncheckBtns(btns){
    for(let i = 0; i < btns.length; i++){
    btns[i].addEventListener('click', editOnCheckedMovie)
}}

function eventForAllButtonInCard(deletBtns, editBtns, checkedBtns){
    eventForDeleteBtns(deletBtns)
    eventForEditBtns(editBtns)

    if(checkedBtns[0].className == 'button uncheckBtn'){
        eventForUncheckBtns(checkedBtns)
    } else{
        eventForCheckBtns(checkedBtns)
    }
}

//добавить событие на кнопку поиска
//кнопка крестика в поле поиска, для обнуления
for(let j = 0; j < searchBtns.length; j++){
    searchBtns[j].addEventListener('click', function(){
        
    if(searchBtns[j].id == 'searchBtnPlane'){
        const param = inputPlane.value
        cardsPlane.innerHTML = ''
        async function search(){
            const response = await request(`${url}/planned/?movie_name=${param}`, 'GET')
            if(response.status == 200){
                const answer = await response.json()
                for(let i = 0; i < answer.length; i++){
                    const card = document.createElement('div')
                    card.className = 'card'
                    card.innerHTML = createCard(answer[i].movie_name, answer[i].year, answer[i].movie_id, 'uncheckBtn')
                    cardsPlane.appendChild(card)
                    const deleteBtns = document.getElementsByClassName('button deleteBtn')
                    const editBtns = document.getElementsByClassName('button editBtn')
                    const checkBtns = document.getElementsByClassName('button uncheckBtn')
                    eventForAllButtonInCard(deleteBtns, editBtns, checkBtns)
                }
            }
        }
        search()
    }else if(searchBtns[j].id == 'searchBtnWatch'){
        const param = inputWatch.value
        cardsWatch.innerHTML = ''
        async function search(){
            const response = await request(`${url}/seen/?movie_name=${param}`,'GET') 
    
            if(response.status == 200){
                const answer = await response.json()
                for(let i = 0; i < answer.length; i++){
                    const card = document.createElement('div')
                    card.className = 'card'
                    card.innerHTML = createCard(answer[i].movie_name, answer[i].year, answer[i].movie_id, 'checkBtn')
                    cardsWatch.appendChild(card)
                    const deleteBtns = document.getElementsByClassName('button deleteBtn')
                    const editBtns = document.getElementsByClassName('button editBtn')
                    const checkBtns = document.getElementsByClassName('button checkBtn')
                    eventForAllButtonInCard(deleteBtns, editBtns, checkBtns)
                }
            }
        }
        search()
    }
    
    // setTimeout(() => {
    //     search()
    // }, 1000);
    })
}

// inputPlane.addEventListener('change', function(){
//     const param = inputPlane.value
//     async function search(){
//         const response = await fetch(`${url}/planned/?movie_name=${param}`, {
//             method: 'GET',
//             headers: new Headers({
//                 "ngrok-skip-browser-warning": "69420",
//             })        
//         }) 

//         if(response.status == 200){
//             const answer = response.json()
//             console.log(answer)
//         }
//     }
//     setTimeout(() => {
//         search()
//     }, 1000);
// })
//после добавления не навешиваются события на кнопки
addBtnPlane.addEventListener('click', () => {
    let inputPlaneValue = inputPlane.value
    if(inputPlaneValue != ''){
        const splitedInput = inputPlaneValue.split(', ')
        console.log(splitedInput[0], splitedInput[1])
        
        async function addMovie(){
            const response = await request(`${url}/movie`, 'POST', createObj(splitedInput[0], splitedInput[1]))
            if(response.status == 200){
                const answer = await response.json()
                console.log(answer)
                const div = document.createElement('div')
                div.className = 'card'
                div.innerHTML = createCard(answer.movie_name, answer.year, answer.movie_id, 'uncheckBtn')
                // const deleteBtns = document.getElementsByClassName('button deleteBtn')
                // const editBtns = document.getElementsByClassName('editInput')
                // const checkBtns = document.getElementsByClassName('button uncheckBtn')
                cardsPlane.appendChild(div)
                inputPlane.value = ''
                eventForAllButtonInCard(document.getElementsByClassName('button deleteBtn'), document.getElementsByClassName('editInput'), document.getElementsByClassName('button uncheckBtn'))
            }
        }
        addMovie()
    }
})


planeBtn.addEventListener('click', function(){
    const divWithBtnPlane = document.getElementById('divWithBtnPlane')
    if(divWithBtnPlane.style.display == 'none'){

        divWithBtnPlane.style.display = 'block'
        async function getPlaneMovies(){
            const response = await request(`${url}/planned`, 'GET')

            if(response.status == 200){
                const answer = await response.json()
                if(answer){
                    cardsPlane.innerHTML = ''
                    for(let i = 0; i < answer.length; i++){
                        const card = document.createElement('div')
                        card.className = 'card'
                        card.innerHTML = createCard(answer[i].movie_name, answer[i].year, answer[i].movie_id, 'uncheckBtn')
                        cardsPlane.appendChild(card)
                        const deleteBtns = document.getElementsByClassName('button deleteBtn')
                        const editBtns = document.getElementsByClassName('button editBtn')
                        const uncheckBtns = document.getElementsByClassName('button uncheckBtn')
                        eventForAllButtonInCard(deleteBtns, editBtns, uncheckBtns)
                    }
                }
            } else{
                console.error('error')
            }
        }
        getPlaneMovies()
    } else{
        divWithBtnPlane.style.display = 'none'
    }
})


watchBtn.addEventListener('click', function(){
    const divWithBtnWatch = document.getElementById('divWithBtnWatch')
    if(divWithBtnWatch.style.display == 'none'){

        divWithBtnWatch.style.display = 'block'
        async function getPlaneMovies(){
            const response = await request(`${url}/seen`, 'GET')

            if(response.status == 200){
                const answer = await response.json()
                    if(answer){
                        cardsWatch.innerHTML = ''
                        for(let i = 0; i < answer.length; i++){
                            const card = document.createElement('div')
                            card.className = 'card'
                            card.innerHTML = createCard(answer[i].movie_name, answer[i].year, answer[i].movie_id, 'checkBtn')
                            cardsWatch.appendChild(card)
                            const deleteBtns = document.getElementsByClassName('button deleteBtn')
                            const editBtns = document.getElementsByClassName('button editBtn')
                            const checkBtns = document.getElementsByClassName('button checkBtn')
                            eventForAllButtonInCard(deleteBtns, editBtns, checkBtns)
                        }
                    }
            } else{
                console.error('error')
            }
        }
        getPlaneMovies()
    } else{
        divWithBtnWatch.style.display = 'none'
    }
})
