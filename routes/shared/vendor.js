const express = require('express')
const router = express.Router()
const {
	check
} = require('express-validator')
const multer = require("multer");
const upload = multer();
const multiRoleMiddleware = require('../../middlewares/multirole_auth')
const rbacMiddleware = require('../../middlewares/rbac')
const expressValidatorMiddleware = require('../../middlewares/expressValidator');
const {
	addVendor,
	vendorlist,
	fetchVendorDetails,
	editVendor,
	deleteVendor
} = require("../../app/controllers/shared/module/VendorController");
const Module = require('../../app/models/Module');
const RbacAction = require('../../app/models/RbacAction');

router.get(
	'/list', 
	multiRoleMiddleware.isAuthenticated, 
	rbacMiddleware.canAccess(Module.MODULE_VENDOR, RbacAction.ACTION_LIST),
	upload.none(),
	expressValidatorMiddleware.catchErrors, vendorlist
)

router.get(
	'/detail', 
	multiRoleMiddleware.isAuthenticated, 
	rbacMiddleware.canAccess(Module.MODULE_VENDOR, RbacAction.ACTION_VIEW),
	upload.none(), 
	[
		check('id')
			.trim()
			.notEmpty().withMessage('Vendor ID is required')
			.isInt().withMessage('Vendor ID must be a number')
	],
	expressValidatorMiddleware.catchErrors,
	fetchVendorDetails
)

router.post(
	'/add', 
	multiRoleMiddleware.isAuthenticated, 
	rbacMiddleware.canAccess(Module.MODULE_VENDOR, RbacAction.ACTION_CREATE),
	upload.none(), 
	[
		check('district_id')
			.trim()
			.notEmpty().withMessage('District ID is required.')
			.isInt().withMessage('District ID must be a number'),
		check('name')
			.trim()
			.notEmpty().withMessage('Vendor name is required.')
			.isLength({
				max: 255
			}).withMessage('Vendor name must contain max 255 characters.')
			.isString().matches(/^[a-zA-Z\s]+$/).withMessage('Vendor name can only contain alphabets'),
		check('gst_number')
			.trim()
			.notEmpty().withMessage('GST number is required.'),
		check('gst_certificate_file_name')
			.trim()
			.notEmpty().withMessage('GST certificate file is required.'),
		check('mobile')
			.trim()
			.notEmpty().withMessage('Vendor mobile number is required.')
			.isMobilePhone('en-IN').withMessage('Please enter a valid mobile number.'),
		check('email')
			.trim()
			.notEmpty().withMessage('Vendor email is required.')
			.isEmail().withMessage('Please enter a valid email address.'),
		check('police_station')
			.trim()
			.notEmpty().withMessage('Police station is required.'),
		check('village')
			.trim()
			.notEmpty().withMessage('Village name is required.'),
		check('locality')
			.trim()
			.notEmpty().withMessage('Locality is required.'),
		check('street_address')
			.trim()
			.notEmpty().withMessage('Street Address is required.'),
		check('pincode')
			.trim()
			.notEmpty().withMessage('Pincode is required.')
			.isLength({
				min: 6,
				max: 6
			}).withMessage('Pincode must be 6 digits.'),
		check('cp_name')
			.trim()
			.notEmpty().withMessage('Contact person name is required.'),
		check('cp_designation')
			.trim()
			.notEmpty().withMessage('Contact person designation is required.'),
		check('cp_aadhaar_number')
			.trim()
			.notEmpty().withMessage('Contact person aadhar number is required.')
			.isLength({
				min: 14,
				max: 14
			}).withMessage('Aadhaar must be 12 digits long.')
			.matches(/^(?!0|1)(?:\d{4}\s){2}\d{4}$/).withMessage('Invalid Aadhaar number.'),
		check('cp_aadhaar_file_name')
			.trim()
			.notEmpty().withMessage('Contact person aadhar file is required.'),
		check('cp_mobile')
			.trim()
			.notEmpty().withMessage('Contact person mobile number is required.')
			.isMobilePhone('en-IN').withMessage('Please enter a valid mobile number.'),
		check('cp_email')
			.trim()
			.notEmpty().withMessage('Contact person email is required.')
			.isEmail().withMessage('Please enter a valid email address.'),
	], 
	expressValidatorMiddleware.catchErrors, 
	addVendor
)

router.post(
	'/edit', 
	multiRoleMiddleware.isAuthenticated, 
	rbacMiddleware.canAccess(Module.MODULE_VENDOR, RbacAction.ACTION_UPDATE),
	upload.none(), 
	[
		check('id')
			.trim()
			.notEmpty().withMessage('Vendor ID is required')
			.isInt().withMessage('Vendor ID must be a number'),
		check('district_id')
			.trim()
			.notEmpty().withMessage('District ID is required.')
			.isInt().withMessage('District ID must be a number'),
		check('name')
			.trim()
			.notEmpty().withMessage('Vendor name is required.')
			.isLength({
				max: 255
			}).withMessage('Vendor name must contain max 255 characters.')
			.isString().matches(/^[a-zA-Z\s]+$/).withMessage('Vendor name can only contain alphabets'),
		check('gst_number')
			.trim()
			.notEmpty().withMessage('GST number is required.'),
		check('gst_certificate_file_name')
			.trim()
			.notEmpty().withMessage('GST certificate file is required.'),
		check('mobile')
			.trim()
			.notEmpty().withMessage('Vendor mobile number is required.')
			.isMobilePhone('en-IN').withMessage('Please enter a valid mobile number.'),
		check('email')
			.trim()
			.notEmpty().withMessage('Vendor email is required.')
			.isEmail().withMessage('Please enter a valid email address.'),
		check('police_station')
			.trim()
			.notEmpty().withMessage('Police station is required.'),
		check('village')
			.trim()
			.notEmpty().withMessage('Village name is required.'),
		check('locality')
			.trim()
			.notEmpty().withMessage('Locality is required.'),
		check('street_address')
			.trim()
			.notEmpty().withMessage('Street Address is required.'),
		check('pincode')
			.trim()
			.notEmpty().withMessage('Pincode is required.')
			.isLength({
				min: 6,
				max: 6
			}).withMessage('Pincode must be 6 digits.'),
		check('cp_name')
			.trim()
			.notEmpty().withMessage('Contact person name is required.'),
		check('cp_designation')
			.trim()
			.notEmpty().withMessage('Contact person designation is required.'),
		check('cp_aadhaar_number')
			.trim()
			.notEmpty().withMessage('Contact person aadhar number is required.')
			.isLength({
				min: 14,
				max: 14
			}).withMessage('Aadhaar must be 12 digits long.')
			.matches(/^(?!0|1)(?:\d{4}\s){2}\d{4}$/).withMessage('Invalid Aadhaar number.'),
		check('cp_aadhaar_file_name')
			.trim()
			.notEmpty().withMessage('Contact person aadhar file is required.'),
		check('cp_mobile')
			.trim()
			.notEmpty().withMessage('Contact person mobile number is required.')
			.isMobilePhone('en-IN').withMessage('Please enter a valid mobile number.'),
		check('cp_email')
			.trim()
			.notEmpty().withMessage('Contact person email is required.')
			.isEmail().withMessage('Please enter a valid email address.'),
	],
	expressValidatorMiddleware.catchErrors,
	editVendor
)

router.post(
	'/delete', 
	multiRoleMiddleware.isAuthenticated, 
	rbacMiddleware.canAccess(Module.MODULE_VENDOR, RbacAction.ACTION_DELETE),
	upload.none(), 
	[
		check('id')
			.trim()
			.notEmpty().withMessage('Vendor ID is required')
			.isInt().withMessage('Vendor ID must be a number')
	],
	expressValidatorMiddleware.catchErrors, 
	deleteVendor
)

module.exports = router;