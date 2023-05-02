const form = document.querySelector('form')
const url = 'http://51.250.108.47'
form.addEventListener('submit', function(event){
    event.preventDefault()

    const formData = new FormData();

    const email = event.target.querySelector('#email').value
    const password = event.target.querySelector('#password').value

    formData.set('username', email);
    formData.set('password', password);

    async function getAnswer(){
        const response = await fetch(`${url}/auth/login`, {
            method: 'POST',
            // headers: {'Content-Type':'multipart/form-data'},
            body: formData
        })
        //удаление токена после выхода
        if(response.status == 200){
            const answer = await response.json()
            const token = answer.access_token
            localStorage.setItem('token', token)//сохранение токена в локальном хранилище
            window.location.href = 'http://localhost:5000/main'
            console.log(localStorage)
        }
    }
    getAnswer()
})

// function authWithEmailAndPassword(email, password){

// }

const registerStr = document.getElementById('registerStr')
registerStr.addEventListener('click', function(){
    window.location.href = 'http://localhost:5000/register'
})
