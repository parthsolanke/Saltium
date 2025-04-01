const mongoose = require('mongoose');

const shareLinkSchema = new mongoose.Schema({
    shareId: {
        type: String,
        required: true,
        unique: true,
    },
    token: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 3600 // Automatically delete after 1 hour
    }
});

module.exports = mongoose.model('ShareLink', shareLinkSchema);
