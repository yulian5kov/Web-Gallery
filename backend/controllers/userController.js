const User = require('../models/userModel')
const jwt = require('jsonwebtoken')

const createToken = (_id) => {
    // _id property of the jwt = _id passed to the createToken, which is the _id of the user logged in 
    return jwt.sign({_id: _id}, process.env.SECRET, { expiresIn: '3d'})
}

// login user
const loginUser = async (req,res) => {
    const {usernameOrEmail, password} = req.body

    try {
        const user = await User.login(usernameOrEmail, password)

        // create a token
        const token = createToken(user._id)

        res.status(200).json({usernameOrEmail, token})
    } catch (error) {
        res.status(400).json({error: error.message})
    }

}

// register user
const registerUser = async (req,res) => {
    const {username, email, password} = req.body

    try {
        const user = await User.register(username, email, password)

        // create a token
        const token = createToken(user._id)

        res.status(200).json({email, username, token})
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

module.exports = {loginUser, registerUser}