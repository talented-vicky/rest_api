const fs = require('fs')
const path = require('path')

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

exports.fetchPosts = async (req, res, next) => {
    const fetchedPosts = await Post.find()
    try {
        res.status(200).json({
            message: "Fetched posts successfully",
            posts: fetchedPosts
        })
    } catch (error) {
        errorHandler(error, next)
    }
}

exports.fetchPost = async (req, res, next) => {
    const postID = req.params.postId
    const post = await Post.findById(postID)
    try {
        if(!post){
            const error = new Error("No post found")
            error.statusCode = 404
            throw error
            // although I'm throwing an error in a then block
            // the next catch block will be reached, throwing the 
            // error into the catch block (where I then next the error)
        }
        res.status(200).json({
            message: "Fetched post successfully",
            post: post
        })
    } catch (error) {
        errorHandler(error, next)   
    }
}

exports.createPost = async (req, res, next) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        const error = new Error('Ensure miminum of 5 char for title and 10 char for content')
        error.statusCode = 422
        throw error
        // the above line exits the function and reaches the next error handling
        // middleware in the express application
    }
    const image = req.file
    console.log(image)
    if(!image){
        const error = new Error("No file uploaded")
        error.statusCode = 422
        return next(error)
    }
    const imgUrl = image.path
    const title = req.body.title
    const content = req.body.content
    const post = new Post({
        title: title,
        content: content,
        creator: {
            name: "talented boy"
        },
        image: imgUrl
    })
    const postResult = await post.save()
    try {
        res.status(201).json({
            message: "Successfully created post",
            post: postResult
        })
    } catch (error) {
        errorHandler(error, next)
    }
}

exports.updatePost = (req, res, next) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        const error = new Error('Ensure miminum of 5 char for title and 10 char for content')
        error.statusCode = 422
        throw error
    }

    const postID = req.params.postId
    const title = req.body.title
    const content = req.body.content
    let imageUrl = req.body.image
    // image path is now available (by default) in body cause I added it 
    // to postForm.image.value in feedEdit.js (frontend)

    if(req.file){
        imageUrl = req.file.path
    }
    if(!imageUrl){
        const error = new Error("No image uploaded")
        error.statusCode = 422
        throw error
    }

    // const post = await Post.findById(postID)
    // try {
    //     if(!post){
    //         const error = new Error("No post found")
    //         error.statusCode = 404
    //         throw error
    //     }
    //     if(imageUrl !== post.image){
    //         clearImage(post.image)
    //     }
    //     post.title = title
    //     post.content = content
    //     post.image = imageUrl
    //     const newPost = await post.save()
    //     try {
    //         res.status(201).json({message: 'Update successful', post: newPost})
    //     } catch (error) {
    //         errorHandler(error, next)    
    //     }
    // } catch (error) {
    //     errorHandler(error, next)
    // }
    Post.findById(postID)
        .then(post => {
            if(!imageUrl){
                const error = new Error("No image uploaded")
                error.statusCode = 422
                throw error
            }
            if(imageUrl !== post.image){
                clearImage(post.image)
            }
            post.title = title
            post.content = content
            post.image = imageUrl
            return post.save()
        })
        .then(result => {
            res.status(201).json({message: 'Successfully updated post', post: result})
        })
        .catch(err => errorHandler(err, next))
}
const clearImage = imagePath => {
    filepath = path.join(__dirname, '..', imagePath)
    fs.unlink(filepath, err => console.log(err))
}

exports.deletePost = async (req, res, next) => {
    const postID = req.params.postId
    const post = await Post.findByIdAndDelete(postID)
    try {
        if(!post){
            const error = new Error("No post found")
            error.statusCode = 404
            throw error
        }
        res.status(201).json({message: 'Successfully deleted post'})
    } catch (error) {
        errorHandler(error, next)       
    }
}