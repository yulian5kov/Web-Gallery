const express = require('express')

// controller functions
const {
    createRoom,
    addMembersToRoom,
    updateMemberRole,
    getRoomDetails,
    getAllRooms
} = require('../controllers/roomController.js')

const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

// require auth for all workout routes
router.use(requireAuth)

// POST a new room
router.post('/', createRoom)

// Add Members to a Room
router.patch('/:roomId', addMembersToRoom)

// Update Member Role
router.patch('/:roomId/member/:memberId', updateMemberRole)

// Get Room Details
router.get('/:roomId', getRoomDetails)

// Get All Rooms
router.get('/', getAllRooms)

module.exports = router