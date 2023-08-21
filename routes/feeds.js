const express = require('express')

const {body} = require('express-validator')

const router = express.Router()

const feedCtrl = require('../controllers/feeds')
const authCtrl = require('../middlewares/auth')

router.get('/posts', authCtrl, feedCtrl.fetchPosts)

router.get('/post/:postId', authCtrl, feedCtrl.fetchPost)

router.post('/posts', authCtrl,
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

router.put('/posts/:postId', authCtrl,
    [
        body('title')
            .trim()
            .isLength({min: 5}),
        body('content')
            .trim()
            .isLength({min: 10})
    ],
    feedCtrl.updatePost
)

router.delete('/posts/:postId', authCtrl, feedCtrl.deletePost)

module.exports = router