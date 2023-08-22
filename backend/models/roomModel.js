const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roomSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  privacy: {
    type: String,
    enum: ['public', 'private'], // Choose the appropriate values for privacy
    required: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Assuming you have a User model
    required: true,
  },
  // Additional property for user roles (admin/non-admin)
  members: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Reference the User model
        required: true,
      },
      role: {
        type: String,
        enum: ['admin', 'user'], // Define the roles
        required: true,
        default: 'user', // Default role is 'user'
      },
    },
  ],
  // You can add more properties as needed
  // For example, an array of image URLs, comments, etc.
  // images: [{ type: String }],
  // comments: [{ type: String }],
}, { timestamps: true });

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;
