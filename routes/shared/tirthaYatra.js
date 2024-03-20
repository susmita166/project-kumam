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
    listDetails,
    deleteDetails,
    generateRegistrationNumber
} = require('../../app/controllers/shared/module/TirthaYatraController')

const {
	applicantVerificationDetails,
    getRandomisationDetails,
    deleteRandomBasedOnSpacificId
} = require('../../app/controllers/shared/module/RandomisationTirthaYatraController')



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


    router.post('/delete',
        getFileUploadMiddlewear.none(),
        superadminMiddleware.isAuthenticated, 
        [
            check('ApplicationId')
                .trim()
                .notEmpty().withMessage('ApplicationId ID is required')
        ], 
        expressValidatorMiddleware.catchErrors, deleteDetails)    


    router.get('/GenerateRegNo', 
        superadminMiddleware.isAuthenticated,
        getFileUploadMiddlewear.none(),
        [
            check('ApplicationId')
            .trim()
            .notEmpty().withMessage('ApplicationId ID is required')
        ], 
        expressValidatorMiddleware.catchErrors, generateRegistrationNumber)    
        
        
    router.get('/GetApplcntVerifyList', 
        superadminMiddleware.isAuthenticated,
        getFileUploadMiddlewear.none(),
        [
            check('SchemeID')
            .trim()
            .notEmpty().withMessage('Scheme ID is required'),

            check('TripGroupID')
            .trim()
            .notEmpty().withMessage('TripGroup ID is required'),

            check('DistID')
            .trim()
            .notEmpty().withMessage('Dist ID is required')
        ], 
        expressValidatorMiddleware.catchErrors, applicantVerificationDetails)   
        
    
    router.post('/delete',
    getFileUploadMiddlewear.none(),
    superadminMiddleware.isAuthenticated, 
    [
        check('ApplicationId')
            .trim()
            .notEmpty().withMessage('ApplicationId ID is required')
    ], 
    expressValidatorMiddleware.catchErrors, deleteDetails)        



    router.post('/deleteRandomisationDataBasedOnSpacificId',
    getFileUploadMiddlewear.none(),
    superadminMiddleware.isAuthenticated, 
    expressValidatorMiddleware.catchErrors, deleteRandomBasedOnSpacificId) 
        
        
    router.get('/GetERandAllctnSummary', 
        superadminMiddleware.isAuthenticated,
        getFileUploadMiddlewear.none(),
        [
            check('SchemeID')
            .trim(),

            check('TripGroupID')
            .trim()
        ], 
        expressValidatorMiddleware.catchErrors, getRandomisationDetails)    

module.exports = router