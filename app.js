/*<div class="card">
    <button class="button uncheckBtn" ></button> 
    Lorem ipsum dolor sit amet. 
    <button class="button deleteBtn"></button>
    <button class="button editBtn"></button>
</div>
*/

const searchBtns = document.getElementsByClassName('button searchBtn')
const inputPlane = document.getElementById('inputPlane')
const inputWatch = document.getElementById('inputWatch')

const planeBtn = document.getElementById('btnPlane')
const watchBtn = document.getElementById('btnWatch')

const plane = document.getElementById('plane')
const watch = document.getElementById('watch')

planeBtn.addEventListener('click', function(){
    const divWithBtnPlane = document.getElementById('divWithBtnPlane')
    divWithBtnPlane.style.display = 'block'
    // async function getPlaneMovies(){
    //     const response = await fetch('')

    //     if(response.status == 200){
    //         const answer = await response.json()
    //         if(answer){
    //             for(let i = 0; i < answer.length; i++){

    //             }
    //         }
    //     }
    // }
    // getPlaneMovies()
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
})

