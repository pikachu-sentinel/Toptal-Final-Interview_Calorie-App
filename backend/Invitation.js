const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define an Invitation schema
const invitationSchema = new Schema({
    email: String,
    token: String,
    password: String,
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, default: () => Date.now() + 7*24*60*60*1000 }, // Expires in one week
    accepted: { type: Boolean, default: false } // True if the user has accepted the invitation
  });

const Invitation = mongoose.model('Invitation', invitationSchema);

module.exports = Invitation;
