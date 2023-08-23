const Room = require('../models/roomModel')

// CREATE a room
// GOOD
const createRoom = async (req,res) => {
    const { title } = req.body;
    const creatorId = req.user._id; // Logged-in user's ID

    let emptyFields = []
    if(!title){
        emptyFields.push('title')
    }
    if(emptyFields.length > 0){
        return res.status(400).json({error: "Please fill in all the fields", emptyFields})
    }

    // add to the database
    try {
        const room = await Room.create({ 
            title,
            members: [{user: creatorId, role: 'owner'}]  // Creator is added as an owner
        })
        res.status(200).json(room)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }

}

// DELETE a room
// GOOD
const deleteRoom = async (req, res) => {
  const roomId = req.params.roomId;

  try {
      const room = await Room.findByIdAndDelete(roomId);

      if (!room) {
          return res.status(404).json({ error: 'Room not found' });
      }

      res.status(200).json({ message: 'Room deleted successfully' });
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
};

// DUPLICATE a room
// GOOD
const duplicateRoom = async (req, res) => {
  const roomIdToDuplicate = req.params.roomId;
  const changes = req.body;

  try {
      // Find the room to duplicate
      const roomToDuplicate = await Room.findById(roomIdToDuplicate);

      if (!roomToDuplicate) {
          return res.status(404).json({ error: 'Room not found' });
      }

      // Duplicate the room with optional changes
      const duplicatedRoom = new Room({
          title: changes.title || roomToDuplicate.title, // Keep original title if not changed
          members: roomToDuplicate.members.map(member => ({
              user: member.user,
              role: member.role
          })), // Duplicate members as well
          ...changes // Apply other changes from the request body
      });

      await duplicatedRoom.save();

      res.status(200).json(duplicatedRoom);
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
};


// Add Members to a Room
// GOOD
const addMembersToRoom = async (req, res) => {
    const { members } = req.body;
    const roomId = req.params.roomId;
  
    try {
      const room = await Room.findById(roomId);
  
      if (!room) {
        return res.status(404).json({ error: 'Room not found' });
      }
  
      room.members.push(...members);
      await room.save();
  
      res.status(200).json(room);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
};

// Update Member Role
// GOOD 
const updateMemberRole = async (req, res) => {
    const { newRole } = req.body;
    const { roomId, memberId } = req.params;
  
    try {
      const room = await Room.findById(roomId);
  
      if (!room) {
        return res.status(404).json({ error: 'Room not found' });
      }
  
      const member = room.members.id(memberId);
      if (!member) {
        return res.status(404).json({ error: 'Member not found in room' });
      }
  
      member.role = newRole;
      await room.save();
  
      res.status(200).json(room);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
};
  
// Get Room Details
// GOOD
const getRoomDetails = async (req, res) => {
  const roomId = req.params.roomId;

  try {
      console.log('Fetching room with ID:', roomId);
      const room = await Room.findById(roomId);

      if (!room) {
        console.log('Room not found');
        return res.status(404).json({ error: 'Room not found' });
      }

      console.log('Found room:', room);
      res.status(200).json(room);
  } catch (error) {
      console.error('Error fetching room:', error);
      res.status(400).json({ error: error.message });
  }
};

// Get All Rooms
// GOOD
const getAllRooms = async (req, res) => {
    try {
      const rooms = await Room.find();
      res.status(200).json(rooms);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
};
  
module.exports = {
    createRoom,
    addMembersToRoom,
    updateMemberRole,
    getRoomDetails,
    getAllRooms,
    deleteRoom,
    duplicateRoom
};