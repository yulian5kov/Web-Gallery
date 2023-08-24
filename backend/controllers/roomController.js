const Room = require("../models/roomModel");

// CREATE a room
const createRoom = async (req, res) => {
  const { title, members } = req.body;
  const creatorId = req.user._id; // Logged-in user's ID

  let emptyFields = [];
  if (!title) {
    emptyFields.push("title");
  }
  if (emptyFields.length > 0) {
    return res
      .status(400)
      .json({ error: "Please fill in all the fields", emptyFields });
  }

  let roomMembers = [{ user: creatorId, role: "owner" }]; // Always include the creator as owner

  if (members && Array.isArray(members)) {
    // If members array is provided and is an array
    members.forEach((member) => {
      if (member.user && member.role) {
        roomMembers.push(member);
      }
    });
  }

  // add to the database
  try {
    const room = await Room.create({
      title,
      members: roomMembers,
    });

    const formattedRoom = {
      roomID: room._id,
      title: room.title,
      members: room.members.map((member) => ({
        userID: member.user._id,
        username: member.user.username,
        memberID: member._id,
        role: member.role,
      })),
      __v: room.__v,
    };

    res.status(200).json(formattedRoom);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE a room
const deleteRoom = async (req, res) => {
  const roomId = req.params.roomId;
  const userId = req.user._id;

  try {
    const foundRoom = await Room.findById(roomId); // Rename the variable here

    if (!foundRoom) {
      return res.status(404).json({ error: "Room not found" });
    }

    // Find the member in the room with the given user ID
    const memberWithUserId = foundRoom.members.find((member) => {
      return member.user._id.toString() === userId.toString();
    });

    if (!memberWithUserId) {
      return res
        .status(403)
        .json({ error: "You do not have permission to delete this room" });
    }

    const isOwner = memberWithUserId.role === "owner";

    if (isOwner) {
      await foundRoom.deleteOne();
      return res.status(200).json({ message: "Room deleted successfully" });
    } else {
      return res
        .status(403)
        .json({ error: "You do not have permission to delete this room" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// POST DUPLICATED room
const duplicateRoom = async (req, res) => {
  const { roomId } = req.params;
  // const { body } = req;

  try {
    const originalRoom = await Room.findById(roomId);

    if (!originalRoom) {
      return res.status(404).json({ error: "Room not found" });
    }

    const loggedInUserId = req.user._id; // Logged-in user's ID
    const loggedInUserIsOwner = originalRoom.members.some(
      (member) => member.user.equals(loggedInUserId) && member.role === "owner"
    );

    if (!loggedInUserIsOwner) {
      return res
        .status(403)
        .json({ error: "You're not authorized to duplicate this room" });
    }

    const duplicatedTitle = `Copy of ${originalRoom.title}`;
    const duplicatedMembers = [...originalRoom.members]; // Copy the members array

    const newRoom = await Room.create({
      title: duplicatedTitle,
      members: duplicatedMembers,
    });

    const formattedRoom = {
      roomID: newRoom._id,
      title: newRoom.title,
      members: newRoom.members.map((member) => ({
        userID: member.user._id,
        username: member.user.username,
        memberID: member._id,
        role: member.role,
      })),
      __v: newRoom.__v,
    };

    res.status(200).json(formattedRoom);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ADD Members to a Room
const addMembersToRoom = async (req, res) => {
  const { members } = req.body;
  const roomId = req.params.roomId;

  try {
    const room = await Room.findById(roomId);

    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    room.members.push(...members);
    await room.save();

    const formattedRoom = {
      roomID: room._id,
      title: room.title,
      members: room.members.map((member) => ({
        userID: member.user._id,
        username: member.user.username,
        memberID: member._id,
        role: member.role,
      })),
      __v: room.__v,
    };

    res.status(200).json(formattedRoom);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// UPDATE Member Role
const updateMemberRole = async (req, res) => {
  const { newRole } = req.body;
  const { roomId, memberId } = req.params;
  const loggedInUserId = req.user._id; // Assuming user ID is available in req.user

  try {
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    const member = room.members.find((member) =>
      member.user._id.equals(loggedInUserId)
    );
    if (!member) {
      return res.status(404).json({ error: "Member not found in room" });
    }

    // Check if the requester is the owner
    // Check if the requester is the owner
    if (member.role === "owner") {
      const memberToUpdate = room.members.id(memberId);
      if (!memberToUpdate) {
        return res.status(404).json({ error: "Member not found in room" });
      }

      memberToUpdate.role = newRole;
      await room.save();

      const formattedRoom = {
        roomID: room._id,
        title: room.title,
        members: room.members.map((member) => ({
          userID: member.user._id,
          username: member.user.username,
          memberID: member._id,
          role: member.role,
        })),
        __v: room.__v,
      };

      res.status(200).json(formattedRoom);
    } else {
      res.status(403).json({ error: "Only the owner can change roles" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// GET Room Details
const getRoomDetails = async (req, res) => {
  const roomId = req.params.roomId;

  try {
    const room = await Room.findById(roomId);

    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    const formattedRoom = {
      roomID: room._id,
      title: room.title,
      members: room.members.map((member) => ({
        userID: member.user._id,
        username: member.user.username,
        memberID: member._id,
        role: member.role,
      })),
      __v: room.__v,
    };

    res.status(200).json(formattedRoom);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// GET All Rooms
const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find();

    // Create a new array with updated field names
    const roomsWithUpdatedIDs = rooms.map((room) => ({
      roomID: room._id,
      title: room.title,
      members: room.members.map((member) => ({
        userID: member.user._id,
        username: member.user.username,
        memberID: member._id,
        role: member.role,
      })),
      __v: room.__v,
    }));

    res.status(200).json(roomsWithUpdatedIDs);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE members (owner only)
const deleteMembers = async (req, res) => {
  const { membersToDelete } = req.body;
  const roomId = req.params.roomId;

  try {
    const room = await Room.findById(roomId);

    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    // Check if the requester is the owner
    const requesterId = req.user._id;
    const owner = room.members.find((member) => member.role === "owner");
    if (owner.user.toString() !== requesterId.toString()) {
      return res.status(403).json({ error: "Permission denied" });
    }

    const deletedMembers = [];
    const notFoundMembers = [];

    for (const memberId of membersToDelete) {
      const memberIndex = room.members.findIndex(
        (member) => member._id.toString() === memberId
      );
      if (memberIndex !== -1) {
        const deletedMember = room.members.splice(memberIndex, 1)[0];
        deletedMembers.push({
          memberId: deletedMember._id,
          userId: deletedMember.user._id,
          username: deletedMember.user.username,
        });
      } else {
        notFoundMembers.push(memberId);
      }
    }

    await room.save();

    res.status(200).json({
      message: "Members deleted successfully",
      deletedMembers,
      notFoundMembers,
    });
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
  deleteMembers,
};
