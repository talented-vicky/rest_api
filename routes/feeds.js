const express = require('express')

const router = express.Router()

const feedCrl = require('../controllers/feeds')

router.get('/feed', feedCrl.getFeeds)