const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const path = require('path')

require('dotenv').config()
const database_connection_url = process.env.database_connection_url

const feedRoutes = require('./routes/feeds')

const app = express()

app.use(bodyParser.json()) 
// hence json (coming from client) won't be understood by the server
app.use('/images', express.static(path.join(__dirname, 'images')))
// [0] all request going to /images can be served statically
// [1][0][1] dirname gives access to app.js which is in the same directory as 
// the images folder hence everything in it is easily accessible

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization') // allows content-type to be stored in client-side
    next()
    // hence all request will have the headers above
})

app.use(feedRoutes)

app.use((err, req, res, next) => {
    const status = err.statusCode || 500
    const msg = err.message
    res.status(status).json({
        message: msg
    })
})
mongoose.connect(database_connection_url)
    .then(result => {
        app.listen(8080, "0.0.0.0", () => {
            console.log("successfully connected to MongoDB")
        })
    })
    .catch(err => console.log(err))