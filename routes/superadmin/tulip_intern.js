const express = require('express')
const router = express.Router()
const {check} = require('express-validator')
const multer = require("multer");
const upload = multer();
const superadminMiddleware = require('../../middlewares/superadmin');
const expressValidatorMiddleware = require('../../middlewares/expressValidator');
const {addTulipIntern, tulipInternList, tulipInternDetails, editTulipIntern, deleteTulipIntern} = require('../../app/controllers/superadmin/master/TulipInternController')

router.get('/list',superadminMiddleware.isAuthenticated, upload.none(),expressValidatorMiddleware.catchErrors,tulipInternList)

router.get('/detail',superadminMiddleware.isAuthenticated,upload.none(),[
    check('id')
		.trim()
		.notEmpty().withMessage('Tulip intern ID is required')
		.isInt().withMessage('Tulip intern ID must be a number')
],expressValidatorMiddleware.catchErrors,tulipInternDetails)

router.post('/add', superadminMiddleware.isAuthenticated, upload.none(),[
        check('ulb_id')
			.trim()
			.notEmpty().withMessage('ULB ID is required.')
			.isInt().withMessage('ULB ID must be a number'),
		check('block_id')
			.trim()
			.notEmpty().withMessage('Block ID is required.')
			.isInt().withMessage('Block ID must be a number'),
		check('name')
			.trim()
			.notEmpty().withMessage('Tulip intern name is required.')
			.isLength({max: 50}).withMessage('Tulip intern name must contain max 50 characters.')
			.isString().matches(/^[a-zA-Z\s]+$/).withMessage('Tulip intern name can only contain alphabets'),
        check('father_name')
			.trim()
			.notEmpty().withMessage('Father name is required.')
			.isLength({max: 50}).withMessage('Father name must contain max 50 characters.')
			.isString().matches(/^[a-zA-Z\s]+$/).withMessage('Father name can only contain alphabets'),
        check('village_name')
			.trim()
			.notEmpty().withMessage('villagename is required.')
			.isLength({max: 255}).withMessage('village name must contain max 255 characters.')
			.isString().matches(/^[a-zA-Z\s]+$/).withMessage('village name can only contain alphabets'),
        check('locality_name')
			.trim()
			.notEmpty().withMessage('Locality name is required.')
			.isLength({max: 255}).withMessage('Locality name must contain max 255 characters.')
			.isString().matches(/^[a-zA-Z\s]+$/).withMessage('Locality name can only contain alphabets'),

        check('aadhaar_number')
			.trim()
			.notEmpty().withMessage('Aadhaar name is required.')
            .isLength({
				min: 14,
				max: 14
			}).withMessage('Aadhaar must be 12 digits long.')
			.matches(/^(?!0|1)(?:\d{4}\s){2}\d{4}$/).withMessage('Invalid Aadhaar number.'),

        check('aadhaar_file_name')
			.trim()
			.notEmpty().withMessage('Aadhaar file is required.'),
        check('street_address')
			.trim()
			.notEmpty().withMessage('Street address is required.')
            .isLength({max: 255}).withMessage('Street address must contain max 255 characters.'),
        check('pincode')
			.trim()
			.notEmpty().withMessage('Pincode is required.')
            .isInt().withMessage('Pincode must be numeric.')
            .isLength({ min: 6, max: 6 }).withMessage('Pincode must be 6 digits.'),
        check('mobile')
			.trim()
			.notEmpty().withMessage('Mobile number is required.')
            .isMobilePhone('en-IN').withMessage('Enter a valid Indian mobile number.'),
        check('reporting_date')
			.trim()
			.notEmpty().withMessage('Reporting date is required.')
            .isDate().withMessage('Invalid reporting date format.'),
        check('email')
			.trim()
			.notEmpty().withMessage('Email is required.')
			.isEmail().withMessage('Email is not valid.')
			.isLength({max: 255}).withMessage('Email must contain max 255 characters.'),
        check('tenure_completion_date')
			.trim()
			.notEmpty().withMessage('Tenure completion date is required.')
            .isDate().withMessage('Invalid tenure completion date format.'),
        check('offer_letter_file_name')
			.trim()
			.notEmpty().withMessage('Offer letter file name is required.'),
        check('status')
			.trim()
			.notEmpty().withMessage('Status is required')
			.isNumeric().withMessage('Status must be numeric')
			.isIn(['1', '2']).withMessage('Invalid status')

],expressValidatorMiddleware.catchErrors,addTulipIntern)

router.post('/edit',superadminMiddleware.isAuthenticated, upload.none(),[
    check('id')
    .trim()
    .notEmpty().withMessage('Tulip intern ID is required')
    .isInt().withMessage('Tulip intern ID must be a number'),
    check('ulb_id')
    .trim()
    .notEmpty().withMessage('ULB ID is required.')
    .isInt().withMessage('ULB ID must be a number'),
check('block_id')
    .trim()
    .notEmpty().withMessage('Block ID is required.')
    .isInt().withMessage('Block ID must be a number'),
check('name')
    .trim()
    .notEmpty().withMessage('Tulip intern name is required.')
    .isLength({max: 50}).withMessage('Tulip intern name must contain max 50 characters.')
    .isString().matches(/^[a-zA-Z\s]+$/).withMessage('Tulip intern name can only contain alphabets'),
check('father_name')
    .trim()
    .notEmpty().withMessage('Father name is required.')
    .isLength({max: 50}).withMessage('Father name must contain max 50 characters.')
    .isString().matches(/^[a-zA-Z\s]+$/).withMessage('Father name can only contain alphabets'),
check('village_name')
    .trim()
    .notEmpty().withMessage('villagename is required.')
    .isLength({max: 255}).withMessage('village name must contain max 255 characters.')
    .isString().matches(/^[a-zA-Z\s]+$/).withMessage('village name can only contain alphabets'),
check('locality_name')
    .trim()
    .notEmpty().withMessage('Locality name is required.')
    .isLength({max: 255}).withMessage('Locality name must contain max 255 characters.')
    .isString().matches(/^[a-zA-Z\s]+$/).withMessage('Locality name can only contain alphabets'),

check('aadhaar_number')
    .trim()
    .notEmpty().withMessage('Aadhaar name is required.')
    .isLength({
        min: 14,
        max: 14
    }).withMessage('Aadhaar must be 12 digits long.')
    .matches(/^(?!0|1)(?:\d{4}\s){2}\d{4}$/).withMessage('Invalid Aadhaar number.'),

check('aadhaar_file_name')
    .trim()
    .notEmpty().withMessage('Aadhaar file is required.'),

check('street_address')
    .trim()
    .notEmpty().withMessage('Street address is required.')
    .isLength({max: 255}).withMessage('Street address must contain max 255 characters.'),
check('pincode')
    .trim()
    .notEmpty().withMessage('Pincode is required.')
    .isInt().withMessage('Pincode must be numeric.')
    .isLength({ min: 6, max: 6 }).withMessage('Pincode must be 6 digits.'),
check('mobile')
    .trim()
    .notEmpty().withMessage('Mobile number is required.')
    .isMobilePhone('en-IN').withMessage('Enter a valid Indian mobile number.'),
check('reporting_date')
    .trim()
    .notEmpty().withMessage('Reporting date is required.')
    .isDate().withMessage('Invalid reporting date format.'),
check('email')
    .trim()
    .notEmpty().withMessage('Email is required.')
    .isEmail().withMessage('Email is not valid.')
    .isLength({max: 255}).withMessage('Email must contain max 255 characters.'),
check('tenure_completion_date')
    .trim()
    .notEmpty().withMessage('Tenure completion date is required.')
    .isDate().withMessage('Invalid tenure completion date format.'),
check('offer_letter_file_name')
    .trim()
    .notEmpty().withMessage('Offer letter file name is required.'),
check('status')
    .trim()
    .notEmpty().withMessage('Status is required')
    .isNumeric().withMessage('Status must be numeric')
    .isIn(['1', '2']).withMessage('Invalid status')
],expressValidatorMiddleware.catchErrors,editTulipIntern)

router.post('/delete',superadminMiddleware.isAuthenticated, upload.none(),[
    check('id')
    .trim()
    .notEmpty().withMessage('Tulip intern ID is required')
    .isInt().withMessage('Tulip intern ID must be a number'),
],expressValidatorMiddleware.catchErrors,deleteTulipIntern)

module.exports = router;