const { validationResult } = require('express-validator');
const fs = require('fs');
const logger = require('../util/logger');

const removeUploadedFiles = (uploadedFiles) => {
    if (uploadedFiles) {
        for (const fieldName in uploadedFiles) {
            if (uploadedFiles.hasOwnProperty(fieldName)) {
                const field = uploadedFiles[fieldName];
                field.forEach(item => {
                    const filePath = `${__dirname}/../${item.destination}/${item.filename}`;
                    fs.unlink(filePath, (err) => {
                        if (err) {
                            logger.error(`Error deleting file: ${filePath} - ${err.message}`);
                        }
                    });
                });
            }
        }
    }
}

const catchErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const allErrors = errors.array();
        const defaultErrorMessage = allErrors[0].msg;
        const formattedErrorMessages = allErrors.map(error => ({ message: error.msg, param: error.param }));
        if (req.files) {
            removeUploadedFiles(req.files);
        }
        const statusCode = 422;
        return res.status(statusCode).json({
            message: defaultErrorMessage,
            errors: formattedErrorMessages
        });
    }
    return next();
}

module.exports = {
    catchErrors,
    removeUploadedFiles
}