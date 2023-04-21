
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

const url = 'https://39c4-212-58-102-215.ngrok-free.app'

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
//сделать для check and uncheck movie
//передавать в виде строки
function createCard(name, year, id){
    return `
    <button class="button uncheckBtn" name="${id}"></button> 
    <div class="edit" style="display: none">
        <input type="text" class="editInput" name=${id}>
        <button class="button btnEditInput"></button>
        <button class="button btnCancelInput"></button>
    </div>
    <span>${name}, ${year}</span>
    <button class="button editBtn" name="${id}"></button>
    <button class="button deleteBtn" name="${id}"></button>
`
}

function editMovie(){
    //изменение флажка и изменение в виде кнопки
    if(this.className == 'button editBtn'){
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
        parent.style.display = 'flex'
        editInput.parentElement.style.display = 'block'
        editInput.value = text.innerHTML.trim()
        text.innerHTML = ''
        
        const btnEditInput = parent.querySelector('.button btnEditInput')
        btnEditInput.addEventListener('click', function(){
            const inputValue = editInput.value
            const inputValueSplited = inputValue.split(', ')
            async function editMovie(id){
                const response = await fetch(`${url}/${id}`, {
                    method: 'PATCH',
                    headers: new Headers({
                        "ngrok-skip-browser-warning": "69420",
                        'Content-Type' : 'application/json'
                    }),
                    body: JSON.stringify(createObj(inputValueSplited[0], inputValueSplited[1]))
                }) 
        
                if(response.status == 200){
                    const answer = await response.json()
                    if(answer){
                        editInput.style.display = 'none'
                        text.innerHTML = `${answer.movie_name}, ${answer.year}`
                    }
                }
            }
            editMovie(id)
        })
    } else if(this.className == 'button uncheckBtn'){}
}

function deleteMovie(){
    const parent = this.parentElement
    async function deleteMovie(id){
        const response = await fetch(`${url}/movie/${id}`, {
        method: 'DELETE',
        headers: new Headers({
            "ngrok-skip-browser-warning": "69420"
        }),
    })
        if(response.status == 204){
            parent.remove()
        } else{
            console.error('error')
        }
    }
    deleteMovie(this.name)
}

//добавить событие на кнопку поиска
for(let j = 0; j < searchBtns.length; j++){
    searchBtns[j].addEventListener('click', function(){

    })
}

addBtnPlane.addEventListener('click', () => {
    let inputPlaneValue = inputPlane.value
    if(inputPlaneValue != ''){
        const splitedInput = inputPlaneValue.split(', ')
        console.log(splitedInput[0], splitedInput[1])
        
        async function addMovie(){
            const response = await fetch(`${url}/movie`, {
                method: 'POST',
                headers: new Headers({
                    "ngrok-skip-browser-warning": "69420",
                    'Content-Type' : 'application/json'
                }),
                body: JSON.stringify(createObj(splitedInput[0], splitedInput[1]))
            })
            if(response.status == 200){
                const answer = await response.json()
                console.log(answer)
                const div = document.createElement('div')
                div.className = 'card'
                div.innerHTML = createCard(answer.movie_name, answer.year, answer.movie_id)
                cardsPlane.appendChild(div)
                inputPlane.value = ''
            }
        }
        addMovie()
        const deleteBtns = document.getElementsByClassName('button deleteBtn')
        for(let i = 0; i < deleteBtns.length; i++){
            deleteBtns[i].addEventListener('click', deleteMovie)
        }
        const editBtns = document.getElementsByClassName('editInput')
        for(let i = 0; i < editBtns.length; i++){
            editBtns[i].addEventListener('click', editMovie)
        }
        const checkBtns = document.getElementsByClassName('button uncheckBtn')
        for(let i = 0; i < checkBtns.length; i++){
            checkBtns[i].addEventListener('click', editMovie)
        }
        //добавить событие для кнопки перемещения между списками
    }
})


planeBtn.addEventListener('click', function(){
    const divWithBtnPlane = document.getElementById('divWithBtnPlane')
    if(divWithBtnPlane.style.display == 'none'){

        divWithBtnPlane.style.display = 'block'
        async function getPlaneMovies(){
            const response = await fetch(`${url}/planned`, {
                method: 'GET',
                headers: new Headers({
                    "ngrok-skip-browser-warning": "69420",
                })        
            })

            if(response.status == 200){
                const answer = await response.json()
                if(answer){
                    cardsPlane.innerHTML = ''
                    for(let i = 0; i < answer.length; i++){
                        // if(answer[i].is_seen == false){
                        const card = document.createElement('div')
                        card.className = 'card'
                        card.innerHTML = createCard(answer[i].movie_name, answer[i].year, answer[i].movie_id)
                        cardsPlane.appendChild(card)
                        const deleteBtns = document.getElementsByClassName('button deleteBtn')
                        for(let i = 0; i < deleteBtns.length; i++){
                            deleteBtns[i].addEventListener('click', deleteMovie)
                        }
                        const editBtns = document.getElementsByClassName('button editBtn')
                        for(let i = 0; i < editBtns.length; i++){
                            editBtns[i].addEventListener('click', editMovie)
                        }
                        const checkBtns = document.getElementsByClassName('button uncheckBtn')
                        for(let i = 0; i < checkBtns.length; i++){
                            checkBtns[i].addEventListener('click', editMovie)
                        }
                        //добавить событие для кнопки перемещения между списками
                        // }
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
            const response = await fetch(`${url}/seen`, {
                method: 'GET',
                headers: new Headers({
                    "ngrok-skip-browser-warning": "69420",
                })   
            })

            if(response.status == 200){
                const answer = await response.json()
                    if(answer){
                        cardsWatch.innerHTML = ''
                        for(let i = 0; i < answer.length; i++){
                            // if(answer[i].is_seen == true){
                            const card = document.createElement('div')
                            card.className = 'card'
                            card.innerHTML = createCard(answer[i].movie_name, answer[i].year, answer[i].movie_id)
                            cardsWatch.appendChild(card)
                            const deleteBtns = document.getElementsByClassName('button deleteBtn')
                            for(let i = 0; i < deleteBtns.length; i++){
                                deleteBtns[i].addEventListener('click', deleteMovie)
                            }
                            const editBtns = document.getElementsByClassName('button editBtn')
                            for(let i = 0; i < editBtns.length; i++){
                                editBtns[i].addEventListener('click', editMovie)
                            }
                            //добавить событие для кнопки перемещения между списками
                            // }
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

