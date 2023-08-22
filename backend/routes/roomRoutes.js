const express = require('express')

// controller functions
const {createRoom} = require('../controllers/roomController.js')

const router = express.Router()

// POST a new room
router.post('/create', createRoom)

// GET all rooms

// GET a single room by ID

// PUT (update) a room by ID

// DELETE a room by ID

module.exports = router