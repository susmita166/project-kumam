const { validationResult } = require('express-validator');
const fs = require('fs');
const logger = require('../util/logger');

const removeUploadedFiles = async(FilesDetails) =>{
    try{
        Object.keys(FilesDetails).forEach((key)=>{
            fs.unlinkSync(FilesDetails[key].path);
        });
    }catch(err){
        logger.error(err.toString());
    }
}

const catchErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const allErrors = errors.array();
        const defaultErrorMessage = allErrors[0].msg;
        const formattedErrorMessages = allErrors.map(error => ({ message: error.msg, param: error.param }));
        filesData = req.files;
        if(filesData){
            Object.keys(filesData).forEach((obj)=>{
                if(obj){
                    removeUploadedFiles(filesData[obj]);
                }
            });
        }
        // if (req.files) {
        //     removeUploadedFiles(req.files);
        // }
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