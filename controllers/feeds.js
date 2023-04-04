exports.getPosts = (req, res, next) => {
    res.status(200).json({
        posts: {
            name: "vicky",
            class: "mobile dev"
        }
    })
}

exports.createPost = (req, res, next) => {
    const title = req.body.title
    const content = req.body.content
    res.status(201).json({
        message: "Successfully created post",
        posts: {
            title: title,
            content: content,
            id: new Date().toISOString()
        }
    })
}