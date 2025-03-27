// models/File.js
const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    filename: { type: String, required: true },
    filePath: { type: String, required: true },
    fileHash: { type: String, required: true, unique: true },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    encrypted: { type: Boolean, required: true },
    lastAccessed: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

fileSchema.index({ filename: 1, uploadedBy: 1 }, { unique: true });

module.exports = mongoose.model('File', fileSchema);
