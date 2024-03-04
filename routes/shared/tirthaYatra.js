const express = require('express')
const router = express.Router()
const {
	check
} = require('express-validator')
const getFileUploadMiddlewear = require("../../middlewares/fileUpload");
const superadminMiddleware = require('../../middlewares/superadmin');
const expressValidatorMiddleware = require('../../middlewares/expressValidator');
const {
	insertDetails,
    editDetails,
    listDetails
} = require('../../app/controllers/shared/module/TirthaYatraController')



router.post('/add', 
    getFileUploadMiddlewear.fields([
            { name: 'Photo', maxCount: 1 },
            { name: 'Family_Category_Proof_Document', maxCount: 1 },
            { name: 'Identity_Proof_Document', maxCount: 1 },
            { name: 'marriage_proof_doc', maxCount: 1 },
            { name: 'Spose_Photo', maxCount: 1 },
            { name: 'Attendant_Photo', maxCount: 1 }
    ]), 
    superadminMiddleware.isAuthenticated,
	expressValidatorMiddleware.catchErrors, insertDetails)


router.post('/edit', 
    getFileUploadMiddlewear.fields([
            { name: 'Photo', maxCount: 1 },
            { name: 'Family_Category_Proof_Document', maxCount: 1 },
            { name: 'Identity_Proof_Document', maxCount: 1 },
            { name: 'marriage_proof_doc', maxCount: 1 },
            { name: 'Spose_Photo', maxCount: 1 },
            { name: 'Attendant_Photo', maxCount: 1 }
    ]), 
    superadminMiddleware.isAuthenticated,
    [
        check('ApplicationId')
        .trim()
        .notEmpty().withMessage("Application Id Is Required")
    ],
	expressValidatorMiddleware.catchErrors, editDetails)


router.get('/list', 
    superadminMiddleware.isAuthenticated,
    getFileUploadMiddlewear.none(),
	[
        check('ApplicationId')
        .trim()
    ], 
    expressValidatorMiddleware.catchErrors, listDetails)    



module.exports = router