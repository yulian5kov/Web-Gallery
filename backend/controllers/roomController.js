const Room = require('../models/roomModel')

// CREATE a room
// GOOD
const createRoom = async (req,res) => {
    const { title, members } = req.body;
    const creatorId = req.user._id; // Logged-in user's ID

    let emptyFields = []
    if(!title){
        emptyFields.push('title')
    }
    if(emptyFields.length > 0){
        return res.status(400).json({error: "Please fill in all the fields", emptyFields})
    }

    let roomMembers = [{ user: creatorId, role: 'owner' }]; // Always include the creator as owner

    if (members && Array.isArray(members)) {
      // If members array is provided and is an array
      members.forEach(member => {
          if (member.user && member.role) {
              roomMembers.push(member);
          }
      });
  }

    // add to the database
    try {
        const room = await Room.create({ 
            title,
            members: roomMembers
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
  const userId = req.user._id;

  try {
      const foundRoom = await Room.findById(roomId); // Rename the variable here

      if (!foundRoom) {
        return res.status(404).json({ error: 'Room not found' });
      }

      // Find the member in the room with the given user ID
      const memberWithUserId = foundRoom.members.find(member => {
        return member.user._id.toString() === userId.toString();
      });
      
      if (!memberWithUserId) {
        return res.status(403).json({ error: 'You do not have permission to delete this room' });
      }

      const isOwner = memberWithUserId.role === 'owner';
      
      if (isOwner) {
        await foundRoom.deleteOne();
        return res.status(200).json({ message: 'Room deleted successfully' });
      } else {
        return res.status(403).json({ error: 'You do not have permission to delete this room' });
      }
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
      const room = await Room.findById(roomId)
        .populate({
        path: 'members.user',
        select: 'username' // Fetch only the username field
      })
        .exec();
  
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
      const room = await Room.findById(roomId)
        .populate({
          path: 'members.user',
          select: 'username' // Fetch only the username field
        })
        .exec();

      if (!room) {
        return res.status(404).json({ error: 'Room not found' });
      }

      res.status(200).json(room);
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
};

// Get All Rooms
// GOOD
const getAllRooms = async (req, res) => {
    try {
      const rooms = await Room.find()
        .populate('members.user', 'username') // Populate user's username from the 'User' collection
        .exec();
      res.status(200).json(rooms);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
};

// DELETE members (owner only)
// GOOD
const deleteMembers = async (req, res) => {
  const { membersToDelete } = req.body;
  const roomId = req.params.roomId;

  try {
    const room = await Room.findById(roomId);

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    // Check if the requester is the owner
    const requesterId = req.user._id;
    const owner = room.members.find(member => member.role === 'owner');
    if (owner.user.toString() !== requesterId.toString()) {
      return res.status(403).json({ error: 'Permission denied' });
    }

    const deletedMembers = [];
    const notFoundMembers = [];

    for (const memberId of membersToDelete) {
      const memberIndex = room.members.findIndex(member => member._id.toString() === memberId);
      if (memberIndex !== -1) {
        const deletedMember = room.members.splice(memberIndex, 1)[0];
        deletedMembers.push({
          memberId: deletedMember._id,
          userId: deletedMember.user._id,
          username: deletedMember.user.username
        });
      } else {
        notFoundMembers.push(memberId);
      }
    }

    await room.save();

    res.status(200).json({ message: 'Members deleted successfully', deletedMembers, notFoundMembers });
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
    duplicateRoom,
    deleteMembers
};