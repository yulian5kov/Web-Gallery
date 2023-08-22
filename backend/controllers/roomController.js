const Room = require('../models/roomModel')

// login user
const createRoom = async (req,res) => {
    const {title, description, privacy, owner, members} = req.body

    let emptyFields = []
    if(!title){
        emptyFields.push('title')
    }
    if(!description){
        emptyFields.push('description')
    }
    if(!privacy){
        emptyFields.push('privacy')
    }
    if(!owner){
        emptyFields.push('owner')
    }
    if(!members){
        emptyFields.push('members')
    }
    if(emptyFields.length > 0){
        return res.status(400).json({error: "Please fill in all the fields", emptyFields})
    }

    // add to the database
    try {
        
        const room = await Room.create({ title, description, privacy, owner, members })
        res.status(200).json(room)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }

}

module.exports = {createRoom}