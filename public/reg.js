const form = document.querySelector('form')
const url = 'http://51.250.108.47'
form.addEventListener('submit', function(event){
    event.preventDefault()

    const formData = new FormData();

    const email = event.target.querySelector('#email').value
    const password = event.target.querySelector('#password').value

    formData.set('email', email);
    formData.set('password', password);
//совпадение строк при повторном вводе
    async function getAnswer(){
        const response = await fetch(`${url}/auth/register`, {
            method: 'POST',
            // headers: {'Content-Type':'multipart/form-data'},
            body: formData
        })
        console.log(response.status)
        if(response.status == 201){
            const answer = await response.json()
            console.log(answer)
            window.location.href = 'http://localhost:5000/'
        }
    }
    getAnswer()
})