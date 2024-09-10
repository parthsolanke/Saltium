// scripts/cleanupUploads.js
const fs = require('fs');
const path = require('path');
const File = require('../models/File');

const cleanupUploads = async (deleteAll = false) => {
    const uploadsDir = path.join(__dirname, '..', 'uploads');

    try {
        fs.readdir(uploadsDir, async (err, files) => {
            if (err) {
                console.error('Error reading uploads directory:', err);
                return;
            }

            const dbFiles = await File.find({});
            const dbFilePaths = dbFiles.map(file => path.basename(file.filePath));

            files.forEach(file => {
                if (deleteAll || !dbFilePaths.includes(file)) {
                    try {
                        fs.unlinkSync(path.join(uploadsDir, file));
                        console.log(`Removed ${deleteAll ? 'file' : 'orphaned file'}: ${file}`);
                    } catch (error) {
                        console.error(`Error removing file: ${file}`, error);
                    }
                }
            });

            if (deleteAll) {
                try {
                    fs.rmdirSync(uploadsDir);
                    console.log('Removed uploads directory');
                } catch (error) {
                    console.error('Error removing uploads directory', error);
                }
            }
        });
    } catch (error) {
        console.error('Error cleaning up uploads:', error);
    }
};

cleanupUploads().catch(console.error);
