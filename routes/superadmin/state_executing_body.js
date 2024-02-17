const express = require('express');
const router = express.Router();
const {
    check
} = require('express-validator')
const multer = require("multer");
const upload = multer();
const superadminMiddleware = require('../../middlewares/superadmin');
const expressValidatorMiddleware = require('../../middlewares/expressValidator');
const {
    addStateExecuting,
    stateExecutingList,
    StateExecutingDetails,
    editStateExecuting,
    deleteStateExecuting
} = require('../../app/controllers/superadmin/master/StateExecutingBodyController')

router.get('/list', superadminMiddleware.isAuthenticated, upload.none(),
    [
        check('state_id')
            .trim()
            .notEmpty().withMessage('State ID is required')
            .isInt().withMessage('State ID must be a number'),
        check('department_id')
            .trim()
            .notEmpty().withMessage('Department ID is required')
            .isInt().withMessage('Department ID must be a number')
    ], expressValidatorMiddleware.catchErrors, stateExecutingList)

router.get('/detail', superadminMiddleware.isAuthenticated, upload.none(),
    [
        check('id')
            .trim()
            .notEmpty().withMessage('State executing ID is required')
            .isInt().withMessage('State executing ID must be a number')
    ], expressValidatorMiddleware.catchErrors, StateExecutingDetails)

router.post('/add', superadminMiddleware.isAuthenticated, upload.none(),
    [
        check('state_id')
            .trim()
            .notEmpty().withMessage('State ID is required.')
            .isInt().withMessage('State ID must be a number'),
        check('department_id')
            .trim()
            .notEmpty().withMessage('Department ID is required.')
            .isInt().withMessage('Department ID must be a number'),
        check('name')
            .trim()
            .notEmpty().withMessage('State executing body name is required.')
            .isLength({
                max: 255
            }).withMessage('State executing body name must contain max 255 characters.')
            .isString().matches(/^[a-zA-Z\s]+$/).withMessage('State executing body name can only contain alphabets'),
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
    ], expressValidatorMiddleware.catchErrors, addStateExecuting)

router.post('/edit', superadminMiddleware.isAuthenticated, upload.none(),
    [
        check('id')
            .trim()
            .notEmpty().withMessage('State executing ID is required')
            .isInt().withMessage('State executing ID must be a number'),
        check('state_id')
            .trim()
            .notEmpty().withMessage('State ID is required')
            .isInt().withMessage('State ID must be a number'),
        check('department_id')
            .trim()
            .notEmpty().withMessage('Department ID is required')
            .isInt().withMessage('Department ID must be a number'),
        check('name')
            .trim()
            .notEmpty().withMessage('State executing body name is required.')
            .isLength({
                max: 255
            }).withMessage('State executing body name must contain max 255 characters.')
            .isString().matches(/^[a-zA-Z\s]+$/).withMessage('State executing body name can only contain alphabets'),
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
    ], expressValidatorMiddleware.catchErrors, editStateExecuting)

router.post('/delete', superadminMiddleware.isAuthenticated, upload.none(),
    [
        check('id')
        .notEmpty().withMessage('State executing ID is required')
        .isInt().withMessage('State executing ID must be a number')

    ], expressValidatorMiddleware.catchErrors, deleteStateExecuting)

module.exports = router;