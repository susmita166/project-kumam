const express = require('express')
const router = express.Router()
const multer = require("multer");
const upload = multer();
const {
	check
} = require("express-validator");
const superadminMiddleware = require('../../middlewares/superadmin');
const expressValidatorMiddleware = require('../../middlewares/expressValidator');
const {
	addDepartment,
	departmentList,
	departmentDetail,
	editDepartment,
	deleteDepartment
} = require('../../app/controllers/superadmin/master/DepartmentController')

router.get('/list', superadminMiddleware.isAuthenticated, upload.none(), departmentList)

router.get('/detail', superadminMiddleware.isAuthenticated, upload.none(),
	[
		check('id')
			.trim()
			.notEmpty().withMessage('Department ID is required')
			.isInt().withMessage('Department ID must be a number')
	], expressValidatorMiddleware.catchErrors, departmentDetail)

router.post('/add', superadminMiddleware.isAuthenticated, upload.none(),
	[
		check('name')
			.trim()
			.notEmpty().withMessage('Department name is required.')
			.isLength({
				max: 255
			}).withMessage('Department name must contain max 255 characters.')
			.isString().matches(/^[a-zA-Z\s]+$/).withMessage('Department name can only contain alphabets'),
		check('status')
			.trim()
			.notEmpty().withMessage('Status is required')
			.isNumeric().withMessage('Status must be numeric')
			.isIn(['1', '2']).withMessage('Invalid status')
	], expressValidatorMiddleware.catchErrors, addDepartment)

router.post('/edit', superadminMiddleware.isAuthenticated, upload.none(),
	[
		check('id')
			.notEmpty().withMessage('Department ID is required')
			.isInt().withMessage('Department ID must be a number'),
		check('name')
			.trim()
			.notEmpty().withMessage('Department name is required.')
			.isLength({
				max: 255
			}).withMessage('Department name must contain max 255 characters.')
			.isString().matches(/^[a-zA-Z\s]+$/).withMessage('Department name can only contain alphabets'),
		check('status')
			.trim()
			.notEmpty().withMessage('Status is required')
			.isNumeric().withMessage('Status must be numeric')
			.isIn(['1', '2']).withMessage('Invalid status')
	], expressValidatorMiddleware.catchErrors, editDepartment)

router.post('/delete', superadminMiddleware.isAuthenticated, upload.none(),
	[
		check('id')
			.trim()
			.notEmpty().withMessage('Department ID is required')
			.isInt().withMessage('Department ID must be a number')
	], expressValidatorMiddleware.catchErrors, deleteDepartment)

module.exports = router;