const fs = require('fs')
const path = require('path')

const { validationResult } = require('express-validator')

const io = require('../socket')
const Post = require('../models/post')
const User = require('../models/user')

const errorHandler = (error, nxt) => {
    if(!error.statusCode) error.statusCode = 500
    nxt(error)
    // now this goes unto the next express error handling middleware in app.js
}

exports.fetchPosts = async (req, res, next) => {
    const currentPage = req.query.page || 1
    const eachPage = 2
    try {
        const totalDoc = await Post.find().countDocuments()
        const fetchedPosts = await Post.find()
            .populate('creator')
            // .sort({ createdAt: -1}) // descending order 
            .skip((currentPage - 1) * eachPage)
            .limit(eachPage)
        res.status(200).json({
            message: "Fetched posts successfully",
            posts: fetchedPosts,
            totalItems: totalDoc
        })
    } catch (error) {
        errorHandler(error, next)
    }
}

exports.fetchPost = async (req, res, next) => {
    try {
        const postID = req.params.postId
        const post = await Post.findById(postID)
        if(!post){
            const error = new Error("No post found")
            error.statusCode = 404
            throw error
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
    }
    
    if(!req.file){
        const error = new Error("No file uploaded")
        error.statusCode = 422
        return next(error)
    }
    const imgUrl = req.file.path
    const title = req.body.title
    const content = req.body.content
    const post = new Post({
        title: title,
        content: content,
        creator: req.userId,
        image: imgUrl
    })

    try{
        const user = await User.findOne({_id: req.userId})
        // const user = await User.findById(req.userId)
        user.posts.push(post)
        await user.save()
        const postResult = await post.save()
        
        // getting established io in app.js
        io.getIO().emit("posts", {
            action: 'create',
            // post: post
            post: {
                ...post._doc, 
                creator: {
                    name: user.username, 
                    _id: req.userId
                }
            }
        })
        // emit sends to all connected users while broadcast sends to all but sender
        
        res.status(201).json({
            message: "Successfully created post", 
            post: postResult,
            creator: {
                _id: user._id,
                name: user.username
            }
        })
    } catch (error) {
        errorHandler(error, next)
    }
}

exports.updatePost = async (req, res, next) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        const error = new Error('Ensure miminum of 5 char for title and 10 char for content')
        error.statusCode = 422
        throw error
    }
    const postID = req.params.postId; const title = req.body.title; 
    const content = req.body.content; let imageUrl = req.body.image
    // image path is now available (by default) in body cause I added it to postForm.image.value in feedEdit.js (frontend)
    if(req.file) imageUrl = req.file.path
    if(!imageUrl){
        const error = new Error("No image uploaded")
        error.statusCode = 422
        throw error
    }

    try {
        // const post = await Post.findById(postID) // first case
        const post = await Post.findById(postID).populate('creator')
        // console.log(post)

        // comment below comment upon verification of necessity
        // populate ensures "post" const is being returned along with
        // the creator field (which is referencing the user and
        // hence the entire user data) means we'll have the post 
        // data and all the user data alongside it
        if(!post) {
            const error = new Error("No Post Found")
            error.statusCode = 422
            throw error
        }
        // if(post.creator.toString() !== req.userId){ //init case
        // reason: post.creator is a ref to the user which just
        // fetches the user._id

        // but as soon as I populate it with creator, it gives
        // the actual data the creator is referencing and not 
        // just the id of the data (data is "user" in this case)
        if(post.creator._id.toString() !== req.userId){
            const error = new Error("Not Authorized to perform this operation")
            error.statusCode = 403
            throw error
        }
        if(imageUrl !== post.image) clearImage(post.image)
        post.title = title; post.content = content; post.image = imageUrl
        editedPost = await post.save()

        io.getIO().emit('posts', {
            action: 'update',
            post: editedPost
        })
        
        return res.status(200).json({
            message: 'Successfully updated post', 
            post: editedPost
        })

    } catch (error) {
        errorHandler(error, next)
    }
}

exports.deletePost = async (req, res, next) => {
    const postID = req.params.postId
    try {
        const post = await Post.findById(postID)
        if(!post){
            const error = new Error("No post found")
            error.statusCode = 404
            throw error
        }
        if(post.creator.toString() !== req.userId){
            const error = new Error("Not authorized to perform this operations")
            error.statusCode = 403
            throw error
        }
        clearImage(post.image)
        const delPost = await Post.findByIdAndRemove(postID)

        const usertemp = await User.findById(req.userId)
        usertemp.posts.pull(postID)
        await usertemp.save()
        
        io.getIO().emit('posts', {
            action: 'delete',
            post: postID
        })
        res.status(200).json({message: `Successfully deleted post with id:  ${delPost._id}`})
    } catch (error) {
        errorHandler(error, next)
    }
}

const clearImage = imagePath => {
    filepath = path.join(__dirname, '..', imagePath)
    fs.unlink(filepath, err => console.log(err))
}
