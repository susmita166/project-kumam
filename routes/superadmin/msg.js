const express = require('express')
const router = express.Router()
const {check} = require('express-validator')
const multer = require("multer");
const upload = multer();
const superadminMiddleware = require('../../middlewares/superadmin');
const expressValidatorMiddleware = require('../../middlewares/expressValidator');
const {addMsgs, msgsList, msgsDetails, editMsgs, deleteMsgs} = require('../../app/controllers/superadmin/master/MsgsController')

router.get('/list',superadminMiddleware.isAuthenticated,upload.none(),expressValidatorMiddleware.catchErrors,msgsList)

router.get('/detail',superadminMiddleware.isAuthenticated,upload.none(),[
    check('id')
		.trim()
		.notEmpty().withMessage('MSG ID is required')
		.isInt().withMessage('MSG ID must be a number')
],expressValidatorMiddleware.catchErrors,msgsDetails)

router.post('/add',superadminMiddleware.isAuthenticated,upload.none(),[
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
    .notEmpty().withMessage('MSG name is required.')
    .isLength({max: 50}).withMessage('MSG must contain max 50 characters.')
    .isString().matches(/^[a-zA-Z\s]+$/).withMessage('MSG name can only contain alphabets'),
check('pan_file_name')
    .trim()
    .notEmpty().withMessage('PAN file is required.'),
check('pan_number')
   .trim()
   .notEmpty().withMessage('PAN number is required.')
   .matches(/^([A-Z]){5}([0-9]){4}([A-Z]){1}$/).withMessage('Invalid PAN number.'),
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
check('street_address')
    .trim()
    .notEmpty().withMessage('Street address is required.')
    .isLength({max: 255}).withMessage('Street address must contain max 255 characters.'),
check('pincode')
    .trim()
    .notEmpty().withMessage('Pincode is required.')
    .isInt().withMessage('Pincode must be numeric.')
    .isLength({ min: 6, max: 6 }).withMessage('Pincode must be 6 digits.'),
check('p_name')
    .trim()
    .notEmpty().withMessage('President name is required.')
    .isLength({max: 50}).withMessage('President name must contain max 50 characters.')
    .isString().matches(/^[a-zA-Z\s]+$/).withMessage('President name can only contain alphabets'),
check('p_father_name')
    .trim()
    .notEmpty().withMessage('President Father name is required.')
    .isLength({max: 50}).withMessage('President Father name must contain max 50 characters.')
    .isString().matches(/^[a-zA-Z\s]+$/).withMessage('President Father name can only contain alphabets'),
check('p_aadhaar_number')
    .trim()
    .notEmpty().withMessage('President Aadhaar is required.')
    .isLength({
        min: 14,
        max: 14
    }).withMessage('Aadhaar must be 12 digits long.')
    .matches(/^(?!0|1)(?:\d{4}\s){2}\d{4}$/).withMessage('Invalid Aadhaar number.'),
check('p_aadhaar_file_name')
    .trim()
    .notEmpty().withMessage('President Aadhaar file is required.'),
check('p_mobile')
    .trim()
    .notEmpty().withMessage('President Mobile number is required.')
    .isMobilePhone('en-IN').withMessage('Enter a valid Indian mobile number.'),
check('p_email')
    .trim()
    .notEmpty().withMessage('President Email is required.')
    .isEmail().withMessage('Email is not valid.')
    .isLength({max: 255}).withMessage('Email must contain max 255 characters.'),
check('s_name')
    .trim()
    .notEmpty().withMessage('Secretary name is required.')
    .isLength({max: 50}).withMessage('Secretary must contain max 50 characters.')
    .isString().matches(/^[a-zA-Z\s]+$/).withMessage('Secretary name can only contain alphabets'),
check('s_father_name')
    .trim()
    .notEmpty().withMessage('Secretary Father name is required.')
    .isLength({max: 50}).withMessage(' Secretary Father name must contain max 50 characters.')
    .isString().matches(/^[a-zA-Z\s]+$/).withMessage('Secretary Father name can only contain alphabets'),
check('s_aadhaar_number')
    .trim()
    .notEmpty().withMessage('Secretary Aadhaar is required.')
    .isLength({
        min: 14,
        max: 14
    }).withMessage('Aadhaar must be 12 digits long.')
    .matches(/^(?!0|1)(?:\d{4}\s){2}\d{4}$/).withMessage('Invalid Aadhaar number.'),
check('s_aadhaar_file_name')
    .trim()
    .notEmpty().withMessage('Secretary Aadhaar file is required.'),
check('s_mobile')
    .trim()
    .notEmpty().withMessage('Secretary Mobile number is required.')
    .isMobilePhone('en-IN').withMessage('Enter a valid Indian mobile number.'),
check('s_email')
    .trim()
    .notEmpty().withMessage('Secretary Email is required.')
    .isEmail().withMessage('Email is not valid.')
    .isLength({max: 255}).withMessage('Email must contain max 255 characters.'),
check('status')
    .trim()
    .notEmpty().withMessage('Status is required')
    .isNumeric().withMessage('Status must be numeric')
    .isIn(['1', '2']).withMessage('Invalid status')
],expressValidatorMiddleware.catchErrors,addMsgs)

router.post('/edit',superadminMiddleware.isAuthenticated,upload.none(),[
check('id')
    .trim()
    .notEmpty().withMessage('MSG ID is required')
    .isInt().withMessage('MSG ID must be a number'),
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
    .notEmpty().withMessage('MSG name is required.')
    .isLength({max: 50}).withMessage('MSG must contain max 50 characters.')
    .isString().matches(/^[a-zA-Z\s]+$/).withMessage('MSG name can only contain alphabets'),
check('pan_file_name')
    .trim()
    .notEmpty().withMessage('PAN file is required.'),
check('pan_number')
   .trim()
   .notEmpty().withMessage('PAN number is required.')
   .matches(/^([A-Z]){5}([0-9]){4}([A-Z]){1}$/).withMessage('Invalid PAN number.'),
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
check('street_address')
    .trim()
    .notEmpty().withMessage('Street address is required.')
    .isLength({max: 255}).withMessage('Street address must contain max 255 characters.'),
check('pincode')
    .trim()
    .notEmpty().withMessage('Pincode is required.')
    .isInt().withMessage('Pincode must be numeric.')
    .isLength({ min: 6, max: 6 }).withMessage('Pincode must be 6 digits.'),
check('p_name')
    .trim()
    .notEmpty().withMessage('President name is required.')
    .isLength({max: 50}).withMessage('President name must contain max 50 characters.')
    .isString().matches(/^[a-zA-Z\s]+$/).withMessage('President name can only contain alphabets'),
check('p_father_name')
    .trim()
    .notEmpty().withMessage('President Father name is required.')
    .isLength({max: 50}).withMessage('President Father name must contain max 50 characters.')
    .isString().matches(/^[a-zA-Z\s]+$/).withMessage('President Father name can only contain alphabets'),
check('p_aadhaar_number')
    .trim()
    .notEmpty().withMessage('President Aadhaar is required.')
    .isLength({
        min: 14,
        max: 14
    }).withMessage('Aadhaar must be 12 digits long.')
    .matches(/^(?!0|1)(?:\d{4}\s){2}\d{4}$/).withMessage('Invalid Aadhaar number.'),
check('p_aadhaar_file_name')
    .trim()
    .notEmpty().withMessage('President Aadhaar file is required.'),
check('p_mobile')
    .trim()
    .notEmpty().withMessage('President Mobile number is required.')
    .isMobilePhone('en-IN').withMessage('Enter a valid Indian mobile number.'),
check('p_email')
    .trim()
    .notEmpty().withMessage('President Email is required.')
    .isEmail().withMessage('Email is not valid.')
    .isLength({max: 255}).withMessage('Email must contain max 255 characters.'),
check('s_name')
    .trim()
    .notEmpty().withMessage('MSG name is required.')
    .isLength({max: 50}).withMessage('MSG must contain max 50 characters.')
    .isString().matches(/^[a-zA-Z\s]+$/).withMessage('MSG name can only contain alphabets'),
check('s_father_name')
    .trim()
    .notEmpty().withMessage('Secretary Father name is required.')
    .isLength({max: 50}).withMessage(' Secretary Father name must contain max 50 characters.')
    .isString().matches(/^[a-zA-Z\s]+$/).withMessage('Secretary Father name can only contain alphabets'),
check('s_aadhaar_number')
    .trim()
    .notEmpty().withMessage('Secretary Aadhaar is required.')
    .isLength({
        min: 14,
        max: 14
    }).withMessage('Aadhaar must be 12 digits long.')
    .matches(/^(?!0|1)(?:\d{4}\s){2}\d{4}$/).withMessage('Invalid Aadhaar number.'),
check('s_aadhaar_file_name')
    .trim()
    .notEmpty().withMessage('Secretary Aadhaar file is required.'),
check('s_mobile')
    .trim()
    .notEmpty().withMessage('Secretary Mobile number is required.')
    .isMobilePhone('en-IN').withMessage('Enter a valid Indian mobile number.'),
check('s_email')
    .trim()
    .notEmpty().withMessage('Secretary Email is required.')
    .isEmail().withMessage('Email is not valid.')
    .isLength({max: 255}).withMessage('Email must contain max 255 characters.'),
check('status')
    .trim()
    .notEmpty().withMessage('Status is required')
    .isNumeric().withMessage('Status must be numeric')
    .isIn(['1', '2']).withMessage('Invalid status')
],editMsgs)

router.post('/delete',superadminMiddleware.isAuthenticated,upload.none(),[
    check('id')
    .trim()
    .notEmpty().withMessage('MSG ID is required')
    .isInt().withMessage('MSG ID must be a number')
],expressValidatorMiddleware.catchErrors,deleteMsgs)

module.exports = router;