const express = require('express')
const router = express.Router()
const {
	check
} = require('express-validator')
const multer = require("multer");
const upload = multer();
const superadminMiddleware = require('../../middlewares/superadmin');
const expressValidatorMiddleware = require('../../middlewares/expressValidator');
const {
	addULBs,
	ULBsList,
	ULBsDetails,
	editULBs,
	deleteULBs
} = require('../../app/controllers/superadmin/master/UrbanLocalBodyController')

router.get('/list', superadminMiddleware.isAuthenticated, upload.none(), expressValidatorMiddleware.catchErrors, ULBsList)

router.get('/detail', superadminMiddleware.isAuthenticated, upload.none(), [
	check('id')
		.trim()
		.notEmpty().withMessage('Urban local body ID is required')
		.isInt().withMessage('Urban local body ID must be a number')
], expressValidatorMiddleware.catchErrors, ULBsDetails)

router.post('/add', superadminMiddleware.isAuthenticated, upload.none(), [
	check('name')
		.trim()
		.notEmpty().withMessage('Urban local body name is required.')
		.isLength({
			max: 255
		}).withMessage('Urban local body name must contain max 255 characters.')
		.isString().matches(/^[a-zA-Z\s]+$/).withMessage('Urban local body name can only contain alphabets'),
	check('type_id')
		.trim()
		.notEmpty().withMessage('Type ID is required.')
		.isInt().withMessage('Type ID must be a number'),
	check('district_id')
		.trim()
		.notEmpty().withMessage('District ID is required.')
		.isInt().withMessage('District ID must be a number'),
	check('population')
		.trim()
		.notEmpty().withMessage('Population is required.')
		.isInt().withMessage('Population must be a number'),
	check('area_acres')
		.trim()
		.notEmpty().withMessage('Area acres is required.')
		.isDecimal({
			decimal_digits: '1,2'
		}).withMessage('Area acres must be a decimal number with up to two decimal places.'),
	check('mayor')
		.trim()
		.notEmpty().withMessage('Mayor name is required.')
		.isLength({
			max: 255
		}).withMessage('Mayor name must contain max 255 characters.')
		.isString().matches(/^[a-zA-Z\s]+$/).withMessage('Mayor name can only contain alphabets'),
	check('deputy_mayor')
		.trim()
		.notEmpty().withMessage('Deputy mayor name is required.')
		.isLength({
			max: 255
		}).withMessage('Deputy mayor name must contain max 255 characters.')
		.isString().matches(/^[a-zA-Z\s]+$/).withMessage('Deputy mayor name can only contain alphabets'),
	check('status')
		.trim()
		.notEmpty().withMessage('Status is required')
		.isNumeric().withMessage('Status must be numeric')
		.isIn(['1', '2']).withMessage('Invalid status')
], expressValidatorMiddleware.catchErrors, addULBs)

router.post('/edit', superadminMiddleware.isAuthenticated, upload.none(), [
	check('id')
		.trim()
		.notEmpty().withMessage('Urban local body ID is required')
		.isInt().withMessage('Urban local body ID must be a number'),
	check('name')
		.trim()
		.notEmpty().withMessage('Urban local body name is required.')
		.isLength({
			max: 255
		}).withMessage('Urban local body must contain max 255 characters.')
		.isString().matches(/^[a-zA-Z\s]+$/).withMessage('Urban local body name can only contain alphabets'),
	check('type_id')
		.trim()
		.notEmpty().withMessage('Type ID is required.')
		.isInt().withMessage('Type ID must be a number'),
	check('district_id')
		.trim()
		.notEmpty().withMessage('District ID is required.')
		.isInt().withMessage('District ID must be a number'),
	check('population')
		.trim()
		.notEmpty().withMessage('Population is required.')
		.isInt().withMessage('Population must be a number'),
	check('area_acres')
		.trim()
		.notEmpty().withMessage('Area acres is required.')
		.isDecimal({
			decimal_digits: '1,2'
		}).withMessage('Area acres must be a decimal number with up to two decimal places.'),
	check('mayor')
		.trim()
		.notEmpty().withMessage('Mayor name is required.')
		.isLength({
			max: 255
		}).withMessage('Mayor name must contain max 255 characters.')
		.isString().matches(/^[a-zA-Z\s]+$/).withMessage('Mayor name can only contain alphabets'),
	check('deputy_mayor')
		.trim()
		.notEmpty().withMessage('Deputy mayor name is required.')
		.isLength({
			max: 255
		}).withMessage('Deputy mayor name must contain max 255 characters.')
		.isString().matches(/^[a-zA-Z\s]+$/).withMessage('Deputy mayor name can only contain alphabets'),
	check('status')
		.trim()
		.notEmpty().withMessage('Status is required')
		.isNumeric().withMessage('Status must be numeric')
		.isIn(['1', '2']).withMessage('Invalid status')
], expressValidatorMiddleware.catchErrors, editULBs)

router.post('/delete', superadminMiddleware.isAuthenticated, upload.none(), [
	check('id')
		.trim()
		.notEmpty().withMessage('Urban local body ID is required')
		.isInt().withMessage('Urban local body ID must be a number')
], expressValidatorMiddleware.catchErrors, deleteULBs)

module.exports = router;