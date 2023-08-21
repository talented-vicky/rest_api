const jwt = require('jsonwebtoken')

require('dotenv').config()
const json_secret = process.env.json_secret

module.exports = (req, res, next) => {
    const header = req.get('Authorization')
    if(!header){
        const err = new Error("Unauthorized access")
        err.statusCode = 401
        throw err
    }
    const token = header.split(' ')[1]
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, json_secret)
    } catch (error) {
        error.statusCode = 500
        throw error
    }
    if(!decodedToken){
        const err = new Error('User not Authenticated')
        err.statusCode = 401
        throw err
    }
    req.userId = decodedToken.userId
    // every token has a userId field (& a token field)
    next()
}