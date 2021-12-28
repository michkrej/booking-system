const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config()
const app = express()

app.use(cors())

app.listen(3000, () => console.log('server is running'))

app.get('/hello', (req, res) => {
    res.send('hello')
})

app.get('/test', (req, res) => {
    res.send('test')
})
