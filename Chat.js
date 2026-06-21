const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    role: {
        type: String,
        enum: ['user', 'model'],
        required: true
    },
    content: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const ChatSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        default: "anonymous_student" // Can be updated later when adding full user signup
    },
    messages: [MessageSchema]
}, { timestamps: true });

module.exports = mongoose.model('Chat', ChatSchema);