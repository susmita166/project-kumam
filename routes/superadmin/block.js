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
	addBlock,
	blockList,
	blockDetails,
	editBlock,
	deleteBlock
} = require('../../app/controllers/superadmin/master/BlockController')

router.get('/list', superadminMiddleware.isAuthenticated, upload.none(),
	[
		check('state_id')
			.trim()
			.isInt().withMessage('State ID must be a number')
			.optional(),
		check('district_id')
			.trim()
			.isInt().withMessage('District ID must be a number')
			.optional()
	], expressValidatorMiddleware.catchErrors, blockList)

router.get('/detail', superadminMiddleware.isAuthenticated, upload.none(),
	[
		check('id')
			.trim()
			.notEmpty().withMessage('Block ID is required')
			.isInt().withMessage('Block ID must be a number')
	], expressValidatorMiddleware.catchErrors, blockDetails)

router.post('/add', upload.none(), superadminMiddleware.isAuthenticated,
	[
		check('state_id')
			.trim()
			.notEmpty().withMessage('State ID is required.')
			.isInt().withMessage('State ID must be a number'),
		check('district_id')
			.trim()
			.notEmpty().withMessage('District ID is required.')
			.isInt().withMessage('District ID must be a number'),
		check('name')
			.trim()
			.notEmpty().withMessage('Block name is required.')
			.isLength({
				max: 255
			}).withMessage('Block name must contain max 255 characters.')
			.isString().matches(/^[a-zA-Z\s]+$/).withMessage('Block name can only contain alphabets'),
		check('status')
			.trim()
			.notEmpty().withMessage('Status is required')
			.isNumeric().withMessage('Status must be numeric')
			.isIn(['1', '2']).withMessage('Invalid status')
	],
	expressValidatorMiddleware.catchErrors, addBlock)

router.post('/edit', superadminMiddleware.isAuthenticated, upload.any(),
	[
		check('id')
			.trim()
			.notEmpty().withMessage('Block ID is required')
			.isInt().withMessage('Block ID must be a number'),
		check('district_id')
			.trim()
			.notEmpty().withMessage('District ID is required')
			.isInt().withMessage('District ID must be a number'),
		check('name')
			.trim()
			.notEmpty().withMessage('Block name is required.')
			.isLength({
				max: 255
			}).withMessage('Block name must contain max 255 characters.')
			.isString().matches(/^[a-zA-Z\s]+$/).withMessage('Block name can only contain alphabets'),
		check('status')
			.trim()
			.notEmpty().withMessage('Status is required')
			.isNumeric().withMessage('Status must be numeric')
			.isIn(['1', '2']).withMessage('Invalid status')
	],
	expressValidatorMiddleware.catchErrors, editBlock)

router.post('/delete', superadminMiddleware.isAuthenticated, upload.none(),
	[
		check('id')
			.trim()
			.notEmpty().withMessage('Block ID is required')
			.isInt().withMessage('Block ID must be a number')
	], expressValidatorMiddleware.catchErrors, deleteBlock)

module.exports = router