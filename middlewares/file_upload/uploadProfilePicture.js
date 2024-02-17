const moment = require('moment');
const sha512 = require("crypto-js/sha512");
const multer = require('multer');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

/**
 * Define the cnonfiguraton to upload files.
 * Set the destination path, and file name.
 */
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const targetDir = 'public/uploads/profile-pictures';
        if (!fs.existsSync(targetDir)){
            fs.mkdirSync(targetDir);
        }
        cb(null, targetDir);
    },
    filename: (req, file, cb) => {
        const originalFileName = file.originalname;
        const originalFileNameArr = originalFileName.split('.');
        const fileExtension = originalFileNameArr[originalFileNameArr.length - 1];
        const currentDateCompressed = moment(new Date()).format("YYYYMMDDHHmmss");
        const fileName = `${sha512(new Date() + currentDateCompressed + uuidv4())}-${currentDateCompressed}.${fileExtension.toLowerCase()}`;
        cb(null, fileName);
    }
});

/**
 * Initiate the multer instance and set the storage configuration.
 * Also, define the limits like file size, and what file extensions are allowed.
 */
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1048576
    },
    fileFilter: (req, file, cb) => {
        if (
            file.mimetype == "image/png" ||
            file.mimetype == "image/jpg" ||
            file.mimetype == "image/jpeg" ||
            file.mimetype == "image/heic" ||
            file.mimetype == "image/heif" ||
            file.mimetype == "image/webp"
        ) {
            return cb(null, true);
        }
        return cb(new Error('Only .png, .jpg, .jpeg, .heic, .heif and .webp file formats are allowed.'));
    }
});

const profilePictureUploadMulter = upload.single('profile_picture');

const validate = (req, res, next) => {
    profilePictureUploadMulter(req, res, function (err) {
        if (err) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                err.message = 'File size too large. Max limit is 5 MB.';
            }
            return res.status(500).json({
                message: err.message
            });
        }
        return next();
    });
}

module.exports = {
    validate
}