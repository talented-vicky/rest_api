const { validationResult } = require('express-validator')
const Post = require('../models/post')

const errorHandler = (error, nxt) => {
    if(!error.statusCode){
        // if the statusCode prop on err doesn't exist, which won't at this point
        error.statusCode = 500
    }
    nxt(error)
    // now this goes unto the next express error handling middleware in app.js
}

exports.fetchPosts = (req, res, next) => {
    Post.find()
        .then(fetchedPosts => {
            res.status(200).json({
                message: "Fetched posts successfully",
                posts: fetchedPosts
            })
        })
        .catch(err => errorHandler(err, next))
}

exports.fetchPost = (req, res, next) => {
    const postID = req.params.postId
    Post.findById(postID)
        .then(fetchedPost => {
            if(!fetchedPost){
                const error = new Error("No post found")
                error.statusCode = 404
                throw error
                // although I'm throwing an error in a then block
                // the next catch block will be reached, throwing the 
                // error into the catch block (where I then next the error)
            }
            res.status(200).json({
                message: "Fetched post successfully",
                post: fetchedPost
            })
        })
        .catch(err => errorHandler(err, next))
}

exports.createPost = (req, res, next) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        const error = new Error('Ensure miminum of 5 char for title and 10 char for content')
        error.statusCode = 422 // adding property to new Error
        throw error
        // the above line exits the function and reaches the next error handling
        // middleware in the express application
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
        .catch(err => errorHandler(err, next))
}