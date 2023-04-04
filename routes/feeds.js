const express = require('express')

const router = express.Router()

const feedCtrl = require('../controllers/feeds')

router.get('/posts', feedCtrl.getPosts)

router.post('/posts', feedCtrl.createPost)

module.exports = router