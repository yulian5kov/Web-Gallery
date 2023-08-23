const express = require('express')

// controller functions
const {
    createRoom,
    addMembersToRoom,
    updateMemberRole,
    getRoomDetails,
    getAllRooms,
    deleteRoom
} = require('../controllers/roomController.js')

const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

// require auth for all workout routes
router.use(requireAuth)

// POST a new room
router.post('/', createRoom)

// ADD Members to a Room
router.patch('/:roomId', addMembersToRoom)

// UPDATE Member Role
router.patch('/:roomId/member/:memberId', updateMemberRole)

// GET Room Details
router.get('/:roomId', getRoomDetails)

// GET All Rooms
router.get('/', getAllRooms)

// DELETE a Rooms
router.delete('/:roomId', deleteRoom)

module.exports = router