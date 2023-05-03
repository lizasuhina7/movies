const form = document.querySelector('form')
const diff = form.querySelector('#difference')
const registerStr = form.querySelector('#registerStr')
const alreadyCreate = form.querySelector('#alreadyCreateUser')
const showPass = form.querySelector('.showPass')

const url = 'http://51.250.108.47'

form.addEventListener('submit', function(event){
    event.preventDefault()

    diff.style.display = 'none'
    alreadyCreate.style.display = 'none'

    const email = event.target.querySelector('#email').value
    const password1 = event.target.querySelector('#password1').value
    const password2 = event.target.querySelector('#password2').value

    if(password1 == password2){
        async function getAnswer(){
            const response = await fetch(`${url}/auth/register`, {
                method: 'POST',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify({
                    email, password: password2
                })
            })
            
            if(response.status == 201){
                window.location.href = 'http://localhost:5000/'
            } else if(response.status == 400){
                // const answer = await response.json()
                // if (answer.detail.msg == 'value is not a valid email address'){
                    alreadyCreate.style.display = 'block'
                // }
            }
        }
        getAnswer()
    } else{
        diff.style.display = 'block'
    }
})

showPass.addEventListener('click', ()=>{
    const passwordInput = form.querySelector('#password1')
    if(passwordInput.type == 'password'){
        passwordInput.type = 'text'
    } else{
        passwordInput.type = 'password'
    }
})
