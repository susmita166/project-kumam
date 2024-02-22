const express = require('express')
const router = express.Router()
const {
	check
} = require('express-validator')

const multer  = require('multer')
// const upload = multer({ dest: 'public/uploads/jobs_docs' })
const getFileUploadMiddlewear = require("../../middlewares/fileUpload");

const superadminMiddleware = require('../../middlewares/superadmin');
const expressValidatorMiddleware = require('../../middlewares/expressValidator');
const {
	addJob,
    editTheJob,
	listJob,
	deleteJob
} = require('../../app/controllers/superadmin/master/jobController')


router.get('/list', superadminMiddleware.isAuthenticated, getFileUploadMiddlewear.none(),
	[
		check('jobId')
			.trim()
			.optional()
	], expressValidatorMiddleware.catchErrors, listJob)

router.post('/add', 
getFileUploadMiddlewear.fields([
		{ name: 'BankDetails', maxCount: 10 },
		{ name: 'EducationCertificate', maxCount: 8 }
]), 
superadminMiddleware.isAuthenticated,
	[
		check('firstName')
			.trim()
			.notEmpty().withMessage('First Name is required.')
			.isAlpha().withMessage('First Name must contain only letters'),
		check('lastName')
			.trim()
			.notEmpty().withMessage('Last Name is required.')
			.isAlpha().withMessage('Last Name must contain only letters'),
		check('Phone_number')
			.trim()
			.notEmpty().withMessage('Phone Number is required.')
			.isMobilePhone('en-IN').withMessage('Invalid Indian phone number'),
        check('email')
			.trim()
			.notEmpty().withMessage('Email is required.')
			.isEmail().withMessage('Invalid email address'),
        check('jobId')
			.trim()
			.notEmpty().withMessage('Job Id required.'),
        check('jobTitle')
			.trim()
			.notEmpty().withMessage('Job Title required.'),    
		check('status')
			.trim()
			.notEmpty().withMessage('Status is required')
			.isNumeric().withMessage('Status must be numeric')
			.isIn(['1', '2']).withMessage('Invalid status')
	],
	expressValidatorMiddleware.catchErrors, addJob)

router.post('/edit',  
	getFileUploadMiddlewear.fields([
	{ name: 'BankDetails', maxCount: 10 },
	{ name: 'EducationCertificate', maxCount: 8 }
	]),
	superadminMiddleware.isAuthenticated,
	[
		check('firstName')
			.trim()
			.notEmpty().withMessage('First Name is required.')
			.isAlpha().withMessage('First Name must contain only letters'),
		check('lastName')
			.trim()
			.notEmpty().withMessage('Last Name is required.')
			.isAlpha().withMessage('Last Name must contain only letters'),
		check('Phone_number')
			.trim()
			.notEmpty().withMessage('Phone Number is required.')
			.isMobilePhone('en-IN').withMessage('Invalid Indian phone number'),
        check('email')
			.trim()
			.notEmpty().withMessage('Email is required.')
			.isEmail().withMessage('Invalid email address'),
        check('jobId')
			.trim()
			.notEmpty().withMessage('Job Id required.'),
        check('jobTitle')
			.trim()
			.notEmpty().withMessage('Job Title required.'),    
		check('status')
			.trim()
			.notEmpty().withMessage('Status is required')
			.isNumeric().withMessage('Status must be numeric')
			.isIn(['1', '2']).withMessage('Invalid status')
	],
	expressValidatorMiddleware.catchErrors, 
	editTheJob)

router.delete('/delete', superadminMiddleware.isAuthenticated, getFileUploadMiddlewear.none(),
	[
		check('jobId')
			.trim()
			.notEmpty().withMessage('Job ID is required')
	], expressValidatorMiddleware.catchErrors, deleteJob)

module.exports = router