import {url} from './config.js'

window.addEventListener('DOMContentLoaded', () => {
    if(localStorage.getItem('token') != null){

        const searchBtnPlane = document.getElementById('searchBtnPlane')
        const searchBtnWatch = document.getElementById('searchBtnWatch')
        const inputPlane = document.getElementById('inputPlane')
        const inputWatch = document.getElementById('inputWatch')

        const planeBtn = document.getElementById('btnPlane')
        const watchBtn = document.getElementById('btnWatch')

        const cardsPlane = document.getElementById('cardsPlane')
        const cardsWatch = document.getElementById('cardsWatch')

        const addBtnPlane = document.getElementById('addBtnPlane')
        const exitBtn = document.getElementById('exit')

        const btnDelete = 'button deleteBtn'
        const btnEdit = 'button editBtn'
        const checkBtn = 'button checkBtn'
        const uncheckBtn = 'button uncheckBtn'

        const createObj = (nameMovie, year = 0) => ({
            "movie_name": nameMovie,
            "year": year,
            "is_seen": false
        })

        function createCard(name, year = 0, id, checked){
            return `
            <button class="button ${checked}" name="${id}"></button> 
            <div class="edit" style="display: none">
                <input type="text" minlength="5" maxlength="40" class="editInput" name="${id}">
                <button class="button btnEditInput" id="${id}"></button>
                <button class="button btnCancelInput" id="cancel ${id}"></button>
            </div>
            <span>${name}, ${year}</span>
            <button class="button editBtn" name="${id}"></button>
            <button class="button deleteBtn" name="${id}"></button>
            `
        }

        async function request(url, method,  body = {}){
            if(method == 'GET'){
                const token = localStorage.getItem('token')
                const response = await fetch(`${url}`, {
                    method: method,
                    headers: new Headers({"Authorization": `Bearer ${token}`})
                }) 
                return response
            } else{
                const token = localStorage.getItem('token')
                const response = await fetch(`${url}`, {
                    method: method,
                    headers: new Headers({"Authorization": `Bearer ${token}`, 'Content-Type':'application/json'}),
                    body: JSON.stringify(body)
                }) 
                return response
            }
        }

        document.body.setAttribute('tabindex', '0')

        function editMovie(){
            const id = this.name
            const parent = this.parentElement
            const text = parent.querySelector('span')
            const textInnerHTML = text.innerHTML
            const editInput = document.querySelector(`input[name="${id}"`)
            const btns = document.querySelectorAll(`button[name="${id}"]`)
            for(let i = 0; i < btns.length; i++){
                btns[i].style.display = 'none'
            }
            const parentEditInput = editInput.parentElement
            parentEditInput.style.display = 'flex'
            editInput.value = text.innerHTML.trim()
            text.innerHTML = ''
            
            const btnEditInput = document.getElementById(id)
            btnEditInput.addEventListener('click', (event)=>{
                const id = event.target.id 
                const inputValue = editInput.value
                const inputValueSplited = inputValue.split(', ')
                let year = inputValueSplited[1] || 0

                async function editMovie(id){
                    try{
                        const response = await request(`${url}/api/movie/${id}`, 'PATCH', createObj(inputValueSplited[0], year))
                        if(response.status == 200){
                            let answer = await response.json()
                            for(let i = 0; i < btns.length; i++){
                                btns[i].style.display = 'inline-block'
                            }
                            parent.style.display = 'block'
                            parentEditInput.style.display = 'none'
                            text.innerHTML = `${answer.movie_name}, ${answer.year}`
                        } else{
                            throw new Error()
                        }
                    } catch(error){
                        console.error(error.message)
                        alert('Error: '+ error.message)
                    }
                }
                editMovie(id)
            })

            const btnsCancelInput = document.getElementById(`cancel ${id}`)
            btnsCancelInput.addEventListener('click', ()=>{
                for(let i = 0; i < btns.length; i++){
                    btns[i].style.display = 'inline-block'
                }
                parent.style.display = 'block'
                parentEditInput.style.display = 'none'
                text.innerHTML = textInnerHTML
            })
            editInput.addEventListener('blur', () => {
                const activElement = document.activeElement
                if(activElement !== document.body){
                    for(let i = 0; i < btns.length; i++){
                        btns[i].style.display = 'inline-block'
                    }
                    parent.style.display = 'block'
                    parentEditInput.style.display = 'none'
                    text.innerHTML = textInnerHTML
                }
            })
        }
        
        function editOnCheckedMovie(){
            const id = this.name
            const button = this
            async function checkedMovie(id){
                const response = await request(`${url}/api/movie/${id}`, 'PATCH', {"is_seen": true})

                if(response.status == 200){
                    button.className = `${checkBtn}`
                    setTimeout(() => {
                        button.parentElement.remove()
                        const clonedElement = button.parentElement.cloneNode(true);
                        cardsWatch.appendChild(clonedElement);
                        eventForAllButtonInCard(clonedElement.getElementsByClassName(`${btnDelete}`), clonedElement.getElementsByClassName(`${btnEdit}`), clonedElement.getElementsByClassName(`${checkBtn}`))
                    }, 500)
                }
            }
            checkedMovie(id)
        }

        function editOnUncheckedMovie(){
            const id = this.name
            const button = this
            async function unCheckedMovie(id){
                const response = await request(`${url}/api/movie/${id}`, 'PATCH', {"is_seen": false})

                if(response.status == 200){
                    button.className = `${uncheckBtn}`
                    setTimeout(() => {
                        button.parentElement.remove()
                        const clonedElement = button.parentElement.cloneNode(true);
                        cardsPlane.appendChild(clonedElement);
                        eventForAllButtonInCard(clonedElement.getElementsByClassName(`${btnDelete}`), clonedElement.getElementsByClassName(`${btnEdit}`), clonedElement.getElementsByClassName(`${uncheckBtn}`))
                    }, 500)
                }
            }
            unCheckedMovie(id)
        }

        function deleteMovie(){
            const parent = this.parentElement
            async function deleteMovie(id){
                const response = await request(`${url}/api/movie/${id}`, 'DELETE')
                if(response.status == 204){
                    parent.remove()
                } else{
                    console.error('error')
                }
            }
            deleteMovie(this.name)
        }

        function eventForBtns(btns, action){
            const handlers = {
                'delete': deleteMovie,
                'edit': editMovie,
                'uncheck': editOnCheckedMovie,
                'check': editOnUncheckedMovie
            }
            const handler = handlers[action]

            for(let i = 0; i < btns.length; i++){
                btns[i].addEventListener('click', handler)
            }
        }

        function eventForAllButtonInCard(deletBtns, editBtns, checkedBtns){
            eventForBtns(deletBtns, 'delete')
            eventForBtns(editBtns, 'edit')
            
            if(checkedBtns[0].className == `${uncheckBtn}`){
                eventForBtns(checkedBtns, 'uncheck')
            } else{
                eventForBtns(checkedBtns, 'check')
            }
        }

        inputPlane.addEventListener('input', function(){
            if(inputPlane.value == ''){
                async function returnAllCards(){
                    try{
                        const response = await request(`${url}/api/planned`, 'GET')
                        if(response.status == 200){
                            const answer = await response.json()
                            cardsPlane.innerHTML = '' // обнуление карточек перед вставкой новых
                            for(let i = 0; i < answer.length; i++){
                                const card = document.createElement('div') // создание карточки
                                card.className = 'card' // присваивание класса карточке
                                card.innerHTML = createCard(answer[i].movie_name, answer[i].year, answer[i].movie_id, 'uncheckBtn') //создание текста карточки
                                cardsPlane.appendChild(card)  //вставка карточки в колонку Plane
                                const deleteBtns = document.getElementsByClassName(`${btnDelete}`) //обращение к кнопкам внутри карточек
                                const editBtns = document.getElementsByClassName(`${btnEdit}`)
                                const uncheckBtns = document.getElementsByClassName(`${uncheckBtn}`)
                                eventForAllButtonInCard(deleteBtns, editBtns, uncheckBtns) // навешивание событий на кнопки внутри карточек
                            }
                        } else{
                            throw new Error()
                        }
                    } catch(error){
                        alert('Error: ' + error.message)
                        console.error(error.message)
                    }
                }
                returnAllCards()
            }
        })

        searchBtnPlane.addEventListener('click', ()=>{
            const param = inputPlane.value
            cardsPlane.innerHTML = ''

            async function search(){
                try{
                    const response = await request(`${url}/api/planned/?movie_name=${param}`, 'GET')
                    if(response.status == 200){
                        const answer = await response.json()
                        for(let i = 0; i < answer.length; i++){
                            const card = document.createElement('div')
                            card.className = 'card'
                            card.innerHTML = createCard(answer[i].movie_name, answer[i].year, answer[i].movie_id, 'uncheckBtn')
                            cardsPlane.appendChild(card)
                            const deleteBtns = document.getElementsByClassName(`${btnDelete}`)
                            const editBtns = document.getElementsByClassName(`${btnEdit}`)
                            const checkBtns = document.getElementsByClassName(`${uncheckBtn}`)
                            eventForAllButtonInCard(deleteBtns, editBtns, checkBtns)
                        }
                    } else{
                        throw new Error()
                    }
                } catch(error){
                    console.error(error)
                    alert('Error: ' + error.message)
                }
            }
            search()
        })

        searchBtnWatch.addEventListener('click', ()=>{
            const param = inputWatch.value
            cardsWatch.innerHTML = ''

            async function search(){
                try{
                    const response = await request(`${url}/api/seen/?movie_name=${param}`,'GET') 
            
                    if(response.status == 200){
                        const answer = await response.json()
                        for(let i = 0; i < answer.length; i++){
                            const card = document.createElement('div')
                            card.className = 'card'
                            card.innerHTML = createCard(answer[i].movie_name, answer[i].year, answer[i].movie_id, 'checkBtn')
                            cardsWatch.appendChild(card)
                            const deleteBtns = document.getElementsByClassName(`${btnDelete}`)
                            const editBtns = document.getElementsByClassName(`${btnEdit}`)
                            const checkBtns = document.getElementsByClassName(`${checkBtn}`)
                            eventForAllButtonInCard(deleteBtns, editBtns, checkBtns)
                        }
                    } else{
                        throw new Error()
                    }
                } catch(error){
                    console.error(error)
                    alert('Error: ' + error.message)
                }
            }
            search()
        })   

        addBtnPlane.addEventListener('click', () => {
            if(addInputAndBtn.style.display == 'none'){
                const addInputAndBtn = document.getElementById('addInputAndBtn')
                const emptyField = document.getElementById('emptyField')
                addInputAndBtn.style.display = 'flex'
                const addBtn = document.getElementById('addBtn')
                const closeBtn = document.getElementById('closeBtn')
                const nameInput = document.getElementById('inputAddName')
                const yearInput = document.getElementById('inputAddYear')

                closeBtn.addEventListener('click', () => {
                    nameInput.value = ''
                    yearInput.value = ''
                    addInputAndBtn.style.display = 'none'
                })

                addBtn.addEventListener('click', () => {
                    const nameValue = nameInput.value
                    
                    if(nameValue != ''){
                        emptyField.style.display = 'none'
                        nameInput.style.border = '0.5px solid black'
                        const yearValue = yearInput.value || 0 //проверка на наличие года
                        async function addMovie(){
                            try{
                                const response = await request(`${url}/api/movie`, 'POST', createObj(nameValue, yearValue))
                                if(response.status == 200){
                                    const answer = await response.json()
                                    const div = document.createElement('div')
                                    div.className = 'card'
                                    div.innerHTML = createCard(answer.movie_name, answer.year, answer.movie_id, 'uncheckBtn')
                                    cardsPlane.appendChild(div)
                                    eventForAllButtonInCard(document.getElementsByClassName(`${btnDelete}`), document.getElementsByClassName(`${btnEdit}`), document.getElementsByClassName(`${uncheckBtn}`))
                                    nameInput.value = ''
                                    yearInput.value = ''
                                } else{
                                    throw new Error()
                                }
                            } catch(error){
                                console.error(error)
                                alert('Error: ' + error.message)
                            }
                        }
                        addMovie()
                    }else{
                        emptyField.style.display = 'block'
                        nameInput.style.border = '2px solid red'
                        //поле для кретика либо по потери фокуса закрываются инпуты
                        //'поле не заполенено'
                    }
                })
            } else{
                addInputAndBtn.style.display = 'none'
            }
        })

        planeBtn.addEventListener('click', function(){
            const divWithBtnPlane = document.getElementById('divWithBtnPlane')
            if(divWithBtnPlane.style.display == 'none'){

                divWithBtnPlane.style.display = 'block'
                async function getPlaneMovies(){
                    try{
                        const response = await request(`${url}/api/planned`, 'GET') //ответ сервера
            
                        if(response.status == 200){ //статуч ответа сервера
                            const answer = await response.json() //получение ответа сервера в виде json
                            cardsPlane.innerHTML = '' // обнуление карточек перед вставкой новых
                            for(let i = 0; i < answer.length; i++){
                                const card = document.createElement('div') // создание карточки
                                card.className = 'card' // присваивание класса карточке
                                card.innerHTML = createCard(answer[i].movie_name, answer[i].year, answer[i].movie_id, 'uncheckBtn') //создание текста карточки
                                cardsPlane.appendChild(card)  //вставка карточки в колонку Plane
                                const deleteBtns = document.getElementsByClassName(`${btnDelete}`) //обращение к кнопкам внутри карточек
                                const editBtns = document.getElementsByClassName(`${btnEdit}`)
                                const uncheckBtns = document.getElementsByClassName(`${uncheckBtn}`)
                                eventForAllButtonInCard(deleteBtns, editBtns, uncheckBtns) // навешивание событий на кнопки внутри карточек
                            }
                        } else{
                            throw new Error()
                        }
                    } catch(error){
                        console.error(error)
                        window.location.href = url
                    }
                }
                getPlaneMovies() // вызов асинхронной функции при клике на кнопку planeBtn, при условии, что 
            } else{
                divWithBtnPlane.style.display = 'none'
            }
        })

        watchBtn.addEventListener('click', function(){
            const divWithBtnWatch = document.getElementById('divWithBtnWatch')
            if(divWithBtnWatch.style.display == 'none'){

                divWithBtnWatch.style.display = 'block'
                async function getPlaneMovies(){
                    try{
                        const response = await request(`${url}/api/seen`, 'GET')
            
                        if(response.status == 200){
                            const answer = await response.json()
                                cardsWatch.innerHTML = ''
                                for(let i = 0; i < answer.length; i++){
                                    const card = document.createElement('div')
                                    card.className = 'card'
                                    card.innerHTML = createCard(answer[i].movie_name, answer[i].year, answer[i].movie_id, 'checkBtn')
                                    cardsWatch.appendChild(card)
                                    const deleteBtns = document.getElementsByClassName(`${btnDelete}`)
                                    const editBtns = document.getElementsByClassName(`${btnEdit}`)
                                    const checkBtns = document.getElementsByClassName(`${checkBtn}`)
                                    eventForAllButtonInCard(deleteBtns, editBtns, checkBtns)
                                }
                        } else{
                            throw new Error()
                        }
                    } catch(error){
                        console.error(error)
                        window.location.href = url
                    }
                }
                getPlaneMovies()
            } else{
                divWithBtnWatch.style.display = 'none'
            }
        })

        exitBtn.addEventListener('click', function(){
            async function logoutUser(){
                const response = await request(`${url}/api/auth/logout`, 'POST')
                if(response.status == 200){
                    window.location.href = url
                    localStorage.removeItem('token')
                }
            }
            logoutUser()
        })

    } else{
        window.location.href = url
    }
})
