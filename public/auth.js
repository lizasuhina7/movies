const form = document.querySelector('form')
const registerStr = form.querySelector('#registerStr')
const wrongPass = form.querySelector('.wrongPass')
const showPass = form.querySelector('.showPass')

const url = 'http://51.250.108.47'
//const url = 'http://localhost:8003'

form.addEventListener('submit', function(event){
    event.preventDefault()

    wrongPass.style.display = 'none'

    const email = event.target.querySelector('#email').value
    const password = event.target.querySelector('#password').value

    const formData = new FormData();

    formData.set('username', email);
    formData.set('password', password);

    async function getAnswer(){
        const response = await fetch(`${url}/api/auth/login`, {
            method: 'POST',
            // headers: {'Content-Type':'multipart/form-data'},
            body: formData
        })

        if(response.status == 200){
            const answer = await response.json()
            const token = answer.access_token
            localStorage.setItem('token', token)//сохранение токена в локальном хранилище
            window.location.href = `${url}/main`
        } else if(response.status == 400){
            // const answer = await response.json()
            // if(answer.detail.msg == 'LOGIN_BAD_CREDENTIALS'){
                wrongPass.style.display = 'block'
            // }
        } else{
            alert('Error: ' + response.status)
            console.log('error' + response.status)
        }
    }
    getAnswer()
})

registerStr.addEventListener('click', () => {
    window.location.href = `${url}/register`
})

showPass.addEventListener('click', ()=>{
    const passwordInput = form.querySelector('#password')
    if(passwordInput.type == 'password'){
        passwordInput.type = 'text'
    } else{
        passwordInput.type = 'password'
    }
})
