const express = require("express");
const {
	check
} = require("express-validator");
const router = express.Router();
const multer = require("multer");
const upload = multer();
const superadminMiddleware = require('../../middlewares/superadmin');
const expressValidatorMiddleware = require('../../middlewares/expressValidator');
const {
	addScheme,
	editScheme,
	schemeList,
	schemeDetail,
	deleteScheme
} = require("../../app/controllers/superadmin/master/SchemeController")

router.get('/list', superadminMiddleware.isAuthenticated, upload.none(),
	[
		check('category_id')
			.trim()
			.notEmpty().withMessage('Category ID is required.')
			.isInt().withMessage('Category ID must be a number')

	], expressValidatorMiddleware.catchErrors, schemeList)

router.get('/detail', superadminMiddleware.isAuthenticated, upload.none(), [
	check('id')
		.trim()
		.notEmpty().withMessage('Scheme ID is required')
		.isInt().withMessage('Scheme ID must be a number')
], expressValidatorMiddleware.catchErrors, schemeDetail)

router.post('/add', superadminMiddleware.isAuthenticated, upload.none(),
	[
		check('category_id')
			.trim()
			.notEmpty().withMessage('Category ID is required.')
			.isInt().withMessage('Category ID must be a number'),
		check('name')
			.trim()
			.notEmpty().withMessage('Scheme name is required.')
			.isLength({
				max: 255
			}).withMessage('Scheme name must contain max 255 characters.')
			.isString().matches(/^[a-zA-Z0-9\s\-]+$/).withMessage('Scheme name can only contain alphabets, numbers, spaces, and hyphens'),
		check('description')
			.trim()
			.notEmpty().withMessage('Description is required.')
			.isLength({
				max: 255
			}).withMessage('Description must contain max 255 characters.')
			.isString().matches(/^[a-zA-Z\s]+$/).withMessage('Description can only contain alphabets'),
		check('status')
			.trim()
			.notEmpty().withMessage('Status is required')
			.isNumeric().withMessage('Status must be numeric')
	], expressValidatorMiddleware.catchErrors, addScheme)

router.post('/edit', superadminMiddleware.isAuthenticated, upload.none(),
	[
		check('id')
			.trim()
			.notEmpty().withMessage('Scheme ID is required')
			.isInt().withMessage('Scheme ID must be a number'),
		check('category_id')
			.trim()
			.notEmpty().withMessage('Category ID is required.')
			.isInt().withMessage('Category ID must be a number'),
		check('name')
			.trim()
			.notEmpty().withMessage('Scheme name is required.')
			.isLength({
				max: 255
			}).withMessage('Scheme name must contain max 255 characters.')
			.isString().matches(/^[a-zA-Z0-9\s\-]+$/).withMessage('Scheme name can only contain alphabets, numbers, spaces, and hyphens'),
		check('description')
			.trim()
			.notEmpty().withMessage('Description is required.')
			.isLength({
				max: 255
			}).withMessage('Description must contain max 255 characters.')
			.isString().matches(/^[a-zA-Z\s]+$/).withMessage('Description can only contain alphabets'),
		check('status')
			.trim()
			.notEmpty().withMessage('Status is required')
			.isNumeric().withMessage('Status must be numeric')
	], expressValidatorMiddleware.catchErrors, editScheme)

router.post('/delete', superadminMiddleware.isAuthenticated, upload.none(),
	[
		check('id')
			.trim()
			.notEmpty().withMessage('Scheme ID is required')
			.isInt().withMessage('Scheme ID must be a number')
	], expressValidatorMiddleware.catchErrors, deleteScheme)

module.exports = router;