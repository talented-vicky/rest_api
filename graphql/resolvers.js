const bcrypt = require('bcryptjs')

const User = require('../models/user')

module.exports = {
    createUser: async ({ userInput }, req) => {
        const oldUser = await User.findOne({ email: userInput.email })
        if(oldUser){
            const error = new Error("User Already exists")
            throw error;
        }
        const hashedPass = await bcrypt.hash(userInput, 12)
        const user = new User({
            email: userInput.email,
            username: userInput.username,
            password: hashedPass
        })
        const newUser = await user.save()
        return {
            ...newUser._doc, _id: newUser._id.toString()
        }
        // ._doc gives all data except the others created by mongoose
    }
}