const User = require("../models/user")

const { validationResult } = require('express-validator')

exports.signup = (req, res, next) => {
    const error = validationResult(req)
    if(!error.isEmpty()){
        error = new Error("Validation failed")
        error.statusCode = 422
        error.data = error.array()
        throw error
    }

    const email = req.body.email
    const username = req.body.username
    const password = req.body.password

}