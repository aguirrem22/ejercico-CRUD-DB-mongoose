const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    title: String,
    completed: String,
}, { timestamps: true });

const User = mongoose.model('Task', UserSchema);

module.exports = User;