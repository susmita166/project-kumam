const express = require('express')
const router = express.Router()
const multer = require("multer");
const upload = multer();
const {
    check
} = require("express-validator");
const superadminMiddleware = require('../../middlewares/superadmin');
const expressValidatorMiddleware = require('../../middlewares/expressValidator');
const moduleController = require('../../app/controllers/superadmin/master/ModuleController')

router.get(
    '/list',
    superadminMiddleware.isAuthenticated,
    upload.none(),
    moduleController.allModules
);

router.get(
    '/detail',
    superadminMiddleware.isAuthenticated,
    upload.none(),
    [
        check('id')
            .trim()
            .notEmpty().withMessage('Module ID is required')
            .isInt().withMessage('Module ID must be a number')
    ],
    expressValidatorMiddleware.catchErrors,
    moduleController.moduleDetail
);

router.post(
    '/add',
    superadminMiddleware.isAuthenticated,
    upload.none(),
    [
        check('name')
            .trim()
            .notEmpty().withMessage('Module name is required.')
            .isLength({
                max: 255
            }).withMessage('Module name must contain max 255 characters.')
            .isString().matches(/^[a-zA-Z\s]+$/).withMessage('Module name can only contain alphabets'),
        check('description')
            .optional()
            .isString()
            .trim()
            .isLength({ max: 1024 }).withMessage('Description must contain max 1024 characters.')
            .matches(/^[a-zA-Z\s]*$/).withMessage('Description can only contain alphabets'),
        check('action_ids')
            .isArray({ min: 1 }).withMessage('Action IDs is required, and must be an array with at least one value')
            .custom((value) => {
                if (!Array.isArray(value)) {
                    throw new Error('Action IDs must be an array');
                }
                if (value.some((id) => typeof id !== 'number' || Number.isNaN(id) || id % 1 !== 0)) {
                    throw new Error('Action IDs must be an array of valid numbers');
                }
                return true;
            }),
        check('status')
            .trim()
            .notEmpty().withMessage('Status is required')
            .isNumeric().withMessage('Status must be numeric')
            .isIn(['1', '2']).withMessage('Invalid status')
    ],
    expressValidatorMiddleware.catchErrors,
    moduleController.addModule
);

router.post(
    '/edit',
    superadminMiddleware.isAuthenticated,
    upload.none(),
    [
        check('id')
            .trim()
            .notEmpty().withMessage('Module ID is required')
            .isInt().withMessage('Module ID must be a valid number'),
        check('name')
            .trim()
            .notEmpty().withMessage('Module name is required.')
            .isLength({
                max: 255
            }).withMessage('Module name must contain max 255 characters.')
            .isString().matches(/^[a-zA-Z\s]+$/).withMessage('Module name can only contain alphabets'),
        check('description')
            .optional()
            .isString()
            .trim()
            .isLength({
                max: 1024
            }).withMessage('Description must contain max 1024 characters.')
            .matches(/^[a-zA-Z\s]+$/).withMessage('Description can only contain alphabets'),
        check('action_ids')
            .isArray({ min: 1 }).withMessage('Action IDs is required, and must be an array with at least one value')
            .custom((value) => {
                if (!Array.isArray(value)) {
                    throw new Error('Action IDs must be an array');
                }
                if (value.some((id) => typeof id !== 'number' || Number.isNaN(id) || id % 1 !== 0)) {
                    throw new Error('Action IDs must be an array of valid numbers');
                }
                return true;
            }),
        check('status')
            .trim()
            .notEmpty().withMessage('Status is required')
            .isNumeric().withMessage('Status must be numeric')
            .isIn(['1', '2']).withMessage('Invalid status')
    ],
    expressValidatorMiddleware.catchErrors,
    moduleController.editModule
);

module.exports = router;