const express = require('express')
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true})) //для post-запроса(принимает данные только в виде строки)
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/auth.html')
})

app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/reg.html')
})

app.get('/main', (req, res)=>{
    res.sendFile(__dirname + '/index.html')
})


const HOST = 'localhost'
const PORT = 5000
app.listen(PORT, () => {
    console.log(`Сервер запущен по адресу http://${HOST}:${PORT}`)
})
