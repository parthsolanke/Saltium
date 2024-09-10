// scripts/cleanupUploads.js
const fs = require('fs');
const path = require('path');
const File = require('../models/File');

const cleanupUploads = async () => {
    const uploadsDir = path.join(__dirname, '..', 'uploads');

    fs.readdir(uploadsDir, async (err, files) => {
        if (err) {
            console.error('Error reading uploads directory:', err);
            return;
        }

        const dbFiles = await File.find({});
        const dbFilePaths = dbFiles.map(file => path.basename(file.filePath));

        files.forEach(file => {
            if (!dbFilePaths.includes(file)) {
                fs.unlinkSync(path.join(uploadsDir, file));
                console.log(`Removed orphaned file: ${file}`);
            }
        });
    });
};

cleanupUploads().catch(console.error);
