const express = require('express')
const router = express.Router()
const {
	check
} = require('express-validator')
const multer = require("multer");
const upload = multer();
const superadminMiddleware = require('../../middlewares/superadmin');
const expressValidatorMiddleware = require('../../middlewares/expressValidator');
const ulbTypeController = require('../../app/controllers/superadmin/master/UrbanLocalBodyTypeController')

router.get('/list', superadminMiddleware.isAuthenticated, upload.none(), expressValidatorMiddleware.catchErrors, ulbTypeController.allUrbanLocalBodyTypes)

router.get('/detail', superadminMiddleware.isAuthenticated, upload.none(), [
	check('id')
		.trim()
		.notEmpty().withMessage('Urban local body type ID is required')
		.isInt().withMessage('Urban local body type ID must be a number')
], expressValidatorMiddleware.catchErrors, ulbTypeController.fetchUrbanLocalBodyTypeDetail)

router.post('/add', superadminMiddleware.isAuthenticated, upload.none(), [
	check('name')
		.trim()
		.notEmpty().withMessage('Name is required.')
		.isLength({
			max: 255
		}).withMessage('Name must contain max 255 characters.')
		.isString().matches(/^[a-zA-Z\s]+$/).withMessage('Name can only contain alphabets'),
	check('status')
		.trim()
		.notEmpty().withMessage('Status is required')
		.isNumeric().withMessage('Status must be numeric')
		.isIn(['1', '2']).withMessage('Invalid status')
], expressValidatorMiddleware.catchErrors, ulbTypeController.addUrbanLocalBodyType)

router.post('/edit', superadminMiddleware.isAuthenticated, upload.none(), [
	check('id')
		.trim()
		.notEmpty().withMessage('Urban local body ID is required')
		.isInt().withMessage('Urban local body ID must be a number'),
	check('name')
		.trim()
		.notEmpty().withMessage('Name is required.')
		.isLength({
			max: 255
		}).withMessage('Name must contain max 255 characters.')
		.isString().matches(/^[a-zA-Z\s]+$/).withMessage('Name can only contain alphabets'),
	check('status')
		.trim()
		.notEmpty().withMessage('Status is required')
		.isNumeric().withMessage('Status must be numeric')
		.isIn(['1', '2']).withMessage('Invalid status')
], expressValidatorMiddleware.catchErrors, ulbTypeController.editUrbanLocalBodyType)

router.post('/delete', superadminMiddleware.isAuthenticated, upload.none(), [
	check('id')
		.trim()
		.notEmpty().withMessage('Urban local body ID is required')
		.isInt().withMessage('Urban local body ID must be a number')
], expressValidatorMiddleware.catchErrors, ulbTypeController.deleteUrbanLocalBodyType)

module.exports = router;