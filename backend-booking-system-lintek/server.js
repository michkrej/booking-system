const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const User = require('./models/user.model')

dotenv.config()
const app = express()

app.use(cors())

app.listen(4000, () => console.log('server is running'))

app.get('/hello', (req, res) => {
    res.send('hello')
})

app.get('/test', (req, res) => {
    res.send('test')
})

app.get('/user', (req, res) => {
    res.send({ id: 1, fadderi: 'STABEN' })
    console.log(req)
})
