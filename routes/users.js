const express = require('express')
const router = express.Router()
const { body } = require('express-validator')


const User = require('../models/user')
const userCtrl = require('../controllers/users')

router.put('/signup', [
    body('email')
        .isEmail()
        .withMessage('Invalid email address')
        .custom(async (val, { req }) => {
            const existingUser = await User.findOne({email: val})
            if(existingUser) return Promise.reject("Email already exists")
        })
        .normalizeEmail(),
    body('password')
        .trim()
        .isLength({min: 8})
        .withMessage('Password must be at least 8 characters'),
    body('name')
        .trim()
        .not()
        .isEmpty()
        .withMessage("username can't be empty characters"),
], userCtrl.signup)

router.post('/login', userCtrl.login)


module.exports = router