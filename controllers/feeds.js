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

        // headers: {
      //   "Content-Type": "application/json"
      //   // json is suitable for ONLY text data, for file and text, we need
      //   // the form data, hence no need for setting headers anymore
      // },
      // body: JSON.stringify({
      //   title: postData.title,
      //   content: postData.content
      // })
}

exports.createPost = (req, res, next) => {
    const errors = validationResult(req)
    const image = req.body
    if(!errors.isEmpty()){
        const error = new Error('Ensure miminum of 5 char for title and 10 char for content')
        error.statusCode = 422 // adding property to new Error
        throw error
        // the above line exits the function and reaches the next error handling
        // middleware in the express application
    }
    console.log(image)
    if(!req.file){
        const error = new Error("No file uploaded")
        error.statusCode = 422
        // throw error
        return next(error)
    }
    const imgUrl = req.file.path
    const title = req.body.title
    const content = req.body.content
    const post = new Post({
        title: title,
        content: content,
        creator: {
            name: "talented boy"
        },
        image: imgUrl
        // image: 'images/meal.jpg'
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

exports.updatePost = (req, res, next) => {
    const errors = validationResult(req)
    const postID = req.params.postId
    const title = req.body.title
    const content = req.body.content
    if(!errors.isEmpty()){
        const error = new Error('Ensure miminum of 5 char for title and 10 char for content')
        error.statusCode = 422
        throw error
    }
    let imageUrl = req.body.image
    // image path is now available (by default) in body cause we added it 
    // to postForm.image.value in feedEdit.js (frontend)
    if(req.file){
        imageUrl = req.file.path
    }
    Post.findById(postID)
        .then(post => {
            if(!imageUrl){
                error = new Error("No image uploaded")
                error.statusCode = 422
                throw error
            }
            Post.title = title
            Post.content = content
            Post.image = imageUrl
        })
        .then(result => {
            Post.save()
        })
        .catch(err => errorHandler(err, next))
}