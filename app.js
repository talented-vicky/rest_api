const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const path = require('path')
const multer = require('multer')

require('dotenv').config()
const database_connection_url = process.env.database_connection_url

const app = express()

const fileStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images')
    },
    filename: (req, file, callback) => {
        const namePref = Date.now() + '-' + Math.round(Math.random() * 1E9)
        callback(null, namePref + '-' + file.originalname)
    }
})

const filter = (req, file, callback) => {
    if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg'){
        callback(null, true)
    }
    else{
        callback(null, false)
    }}

app.use(bodyParser.json()) 
// else json (coming from client) won't be understood by the server

app.use(multer({storage: fileStorage, fileFilter: filter}).single('image'))
// nb: single param is formdata name in react

app.use('/images', express.static(path.join(__dirname, 'images')))
// [0] all request going to /images can be served statically
// [1][0][1] dirname gives access to app.js which is in the same 
// directory as the images folder hence everything in it is 
// easily accessible

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization') // allows content-type to be stored in client-side
    next()
    // hence all request will have the headers above
})

app.use((err, req, res, next) => {
    const status = err.statusCode || 500
    const msg = err.message
    const data = err.data
    res.status(status).json({
        message: msg,
        data: data
    })
})

mongoose.connect(database_connection_url)
    .then(result => {
        app.listen(8080, "0.0.0.0", () => 
            console.log("successfully connected to MongoDB"))
    })
    .catch(err => console.log(err))    

// check my branches and ensure graphql is in a new branch

/*
your dreams, secret to your success (what you do
more that makes you stand out), your problems,
how much you earn, family problems */    
// DSPMF

/*
## a stateless, client-independent API for data exchange
## gets requests, parse the data, return responses with data
A rest API doesn't 
- render views
- store sessions
*/

// a graphQL API is simply a restAPI
// with higher query flexibility
