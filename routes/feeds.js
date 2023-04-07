const express = require('express')

const {body} = require('express-validator')

const router = express.Router()

const feedCtrl = require('../controllers/feeds')

router.get('/posts', feedCtrl.fetchPosts)

router.get('/post/:postId', feedCtrl.fetchPost)

router.post('/posts', 
    [
        body('title')
            .trim()
            .isLength({min: 5}),
        body('content')
            .trim()
            .isLength({min: 10})
    ],
    feedCtrl.createPost
)

module.exports = router