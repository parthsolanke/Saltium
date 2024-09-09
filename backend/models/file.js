// models/File.js
const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    filename: { type: String, required: true },
    filePath: { type: String, required: true },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    encrypted: { type: Boolean, default: true },
});

module.exports = mongoose.model('File', fileSchema);
