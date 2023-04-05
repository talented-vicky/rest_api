const { validationResult } = require('express-validator')
const Post = require('../models/post')

exports.getPosts = (req, res, next) => {
    res.status(200).json({
        posts: [
            {
                _id: "12",
                title: "Aljazeera News",
                content: "A newly posted post al Nassr",
                creator: {
                    name: "vicky"
                },
                createdAt: new Date().toISOString(),
            }
        ]
    })
}

exports.createPost = (req, res, next) => {
    const error = validationResult(req)
    if(!error.isEmpty()){
        return res.status(422).json({
            message: "Ensure miminum of 5 char for title and 10 for content",
            errors: error.array()
        })
    }
    const title = req.body.title
    const content = req.body.content
    const post = new Post({
        title: title,
        content: content,
        creator: {
            name: "talented boy"
        },
        image: 'images/meal.jpg'
    })
    post.save()
        .then(postResult => {
            res.status(201).json({
                message: "Successfully created post",
                post: postResult
            })
        })
        .catch(err => console.log(err))
}