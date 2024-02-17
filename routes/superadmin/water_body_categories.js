const express = require('express')
const router = express.Router()
const { check } = require('express-validator')
const multer = require("multer");
const upload = multer();
const superadminMiddleware = require('../../middlewares/superadmin');
const expressValidatorMiddleware = require('../../middlewares/expressValidator');
const { addWaterBodyCategory, allWaterBodyCategories, fetchWaterBodyCategoriesDetails, editWaterBodyCategories, deleteWaterBodyCategories} = require('../../app/controllers/superadmin/master/WaterBodyCategoriesController')

router.post('/add', superadminMiddleware.isAuthenticated, upload.none(),[
    check('name')
    .trim()
    .notEmpty().withMessage('Name is required.')
    .isLength({max: 255}).withMessage('Name must contain max 255 characters.')
    .isString().matches(/^[a-zA-Z\s]+$/).withMessage('Name can only contain alphabets'),
    check('status')
    .trim()
    .notEmpty().withMessage('Status is required')
    .isNumeric().withMessage('Status must be numeric')
    .isIn(['1', '2']).withMessage('Invalid status')
],expressValidatorMiddleware.catchErrors,addWaterBodyCategory)

router.get('/list',superadminMiddleware.isAuthenticated, upload.none(),expressValidatorMiddleware.catchErrors, allWaterBodyCategories)

router.get('/detail', superadminMiddleware.isAuthenticated, upload.none(), [
	check('id')
		.trim()
		.notEmpty().withMessage('Water Body Category ID is required')
		.isInt().withMessage('Water Body Category ID must be a number')
], expressValidatorMiddleware.catchErrors, fetchWaterBodyCategoriesDetails)

router.post('/edit', superadminMiddleware.isAuthenticated, upload.none(), [
	check('id')
		.trim()
		.notEmpty().withMessage('Water Body Category ID is required')
		.isInt().withMessage('Water Body Category ID must be a number'),
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
], expressValidatorMiddleware.catchErrors, editWaterBodyCategories)

router.post('/delete', superadminMiddleware.isAuthenticated, upload.none(), [
	check('id')
		.trim()
		.notEmpty().withMessage('Water Body Category ID is required')
		.isInt().withMessage('Water Body Category ID must be a number')
], expressValidatorMiddleware.catchErrors, deleteWaterBodyCategories)

module.exports = router;