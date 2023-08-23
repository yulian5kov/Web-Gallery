const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roomSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  members: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Reference to your User model
        required: true
      },
      role: {
        type: String,
        enum: ['owner', 'admin', 'moderator', 'visitor'],
        required: true
      }
    }
  ]
});

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;
