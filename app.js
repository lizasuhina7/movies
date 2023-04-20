
const searchBtns = document.getElementsByClassName('button searchBtn')
const inputPlane = document.getElementById('inputPlane')
const inputWatch = document.getElementById('inputWatch')

const planeBtn = document.getElementById('btnPlane')
const watchBtn = document.getElementById('btnWatch')

const plane = document.getElementById('plane')
const watch = document.getElementById('watch')

const cards = document.getElementById('cardPlane')
const addBtnPlane = document.getElementById('addBtnPlane')

const url = 'https://b32e-212-58-102-215.ngrok-free.app'

function createObj(nameMovie, year){
    let obj = {
        "movie_name": nameMovie,
        "year": year,
        "is_seen": false
    }
    return obj
}

function createCard(name, year, id){
    return `
    <button class="button uncheckBtn"></button> 
    <div class="edit" style="display: none">
        <input type="text" class="editInput" name=${id}>
        <button class="button btnInEditInput"></button>
    </div>
    <span>${name}, ${year}</span>
    <button class="button deleteBtn" name="${id}"></button>
    <button class="button editBtn" name="${id}"></button>
`
}

function editMovie(){
    const id = this.name
    const editInput = document.querySelector(`input[name="${id}"`)
    const parent = this.parentElement
    parent.style.display = 'flex'
    const text = parent.querySelector('span')
    editInput.parentElement.style.display = 'block'
    editInput.value = text.innerHTML.trim()
    text.innerHTML = ''
    //card display: flex;
    // console.log(this.parentElement.textContent) 
    //добавить кнопку внутри инпута
    console.log(editInput)
    // console.log(this.name)
    // console.log(this.parentElement.secondChild)
    // console.log(this.parentElement)
    // async function editMovie(id){
    //     const response = await fetch(`${id}`, {
    //         method: 'PATCH',
    //         headers: {'Content-Type' : 'application/json'},
    //         body: JSON.stringify(createObj())
    //     }) 

    //     if(response.status == ...){

    //     }
    // }
    // editMovie(id)
}

function deleteMovie(){
    console.log(this.name)
    // async function deleteMovie(id){
    //     const response = await fetch(`${url}/movie/${id}`, {
    //     method: 'DELETE'
    // })
    //     if(response.status == 204){
        // console.log(this.parentElement)
            this.parentElement.remove()
        // }
    // }
    // deleteMovie(this.name)
}

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
                const div = document.createElement('div')
                div.className = 'card'
                div.innerHTML = createCard(splitedInput[0], splitedInput[1], 11) //взять из answer  id и вставить в имя и name, year.
                cards.appendChild(div)
                inputPlane.value = ''
            }
        }
        addMovie()
        const deleteBtns = document.getElementsByClassName('button deleteBtn')
        for(let i = 0; i < deleteBtns.length; i++){
            deleteBtns[i].addEventListener('click', deleteMovie)
        }
        const editBtns = document.getElementsByClassName('editInput')
        //добавить событие удаления и изменения
        //добавить событие для кнопки перемещения между списками
    }
})

//добавить событие на кнопку поиска


planeBtn.addEventListener('click', function(){
    const divWithBtnPlane = document.getElementById('divWithBtnPlane')
    // if(divWithBtnPlane.style.display == 'none'){

    
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
                for(let i = 0; i < answer.length; i++){
                    if(answer[i].is_seen == false){
                        const div = document.createElement('div')
                        div.className = 'card'
                        div.innerHTML = createCard(answer[i].movie_name, answer[i].year, answer[i].movie_id)
                        cards.appendChild(div)
                        const deleteBtns = document.getElementsByClassName('button deleteBtn')
                        for(let i = 0; i < deleteBtns.length; i++){
                            deleteBtns[i].addEventListener('click', deleteMovie)
                        }
                        const editBtns = document.getElementsByClassName('button editBtn')
                        for(let i = 0; i < editBtns.length; i++){
                            editBtns[i].addEventListener('click', editMovie)
                        }
                    }
                }
            }
        }
    }
    getPlaneMovies()

    
// } else{
//     divWithBtnPlane.style.display = 'none'
// }
})



watchBtn.addEventListener('click', function(){
    const divWithBtnWatch = document.getElementById('divWithBtnWatch')
    divWithBtnWatch.style.display = 'block'
    // async function getPlaneMovies(){
    //     const response = await fetch('')

    //     if(response.status == 200){
            
    //     }
    // }
    // getPlaneMovies()
    //кнопка делит и редакт
    //кнопка поиска
})

