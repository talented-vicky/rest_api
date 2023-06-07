const express = require('express')
const router = express.Router()
const { body } = require('express-validator')


const User = require('../models/user')
const userCtrl = require('../controllers/users')

router.post('/signup', [
    body('email')
        .isEmail()
        .withMessage('Invalid email address')
        .custom(async (val, { req }) => {
            const userInfo = await User.findOne({email: val})
            if(userInfo) return Promise.reject("User already exists")
        })
        .normalizeEmail(),
    body('password')
        .trim()
        .isLength({min: 7})
        .withMessage('Password shouold be at least 7 characters'),
    body('uername')
        .trim()
        .not()
        .isEmpty()
], userCtrl.signup)

router.post('/login', )


module.exports = router