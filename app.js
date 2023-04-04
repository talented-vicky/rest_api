const express = require('express')
const bodyParser = require('body-parser')

const feedRoutes = require('./routes/feeds')

const app = express()

app.use(bodyParser.json()) 
// hence json (coming from client) won't be understood by the server

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    next()
    // hence all request will have the headers above
})

app.use(feedRoutes)

app.listen(8080)