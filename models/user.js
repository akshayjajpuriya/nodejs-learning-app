const mongoose = require('mongoose');

// The Blueprint (Schema)
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true // No two users can share the same email
    },
    password: {
        type: String,
        required: true
    }
});

// The Factory (Model)
const User = mongoose.model('User', userSchema);

// Export the factory so we can use it elsewhere
module.exports = User;