const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

require('dotenv').config()
const database_connection_url = process.env.database_connection_url

const feedRoutes = require('./routes/feeds')

const app = express()

app.use(bodyParser.json()) 
// hence json (coming from client) won't be understood by the server

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization') // allows content-type to be stored in client-side
    next()
    // hence all request will have the headers above
})

app.use(feedRoutes)

mongoose.connect(database_connection_url)
    .then(() => {
        app.listen(8080)
        console.log("successfully connected to MongoDB")
    })
    .catch(err => console.log(err))