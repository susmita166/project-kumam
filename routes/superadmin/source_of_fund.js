const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const { check } = require('express-validator');
const sourceOfFundController = require('../../app/controllers/superadmin/master/SourceOfFundController');
const superadminMiddleware = require('../../middlewares/superadmin');
const expressValidatorMiddleware = require('../../middlewares/expressValidator');

router.post(
    '/add',
    superadminMiddleware.isAuthenticated,
    upload.none(),
    [
        check('name')
            .trim()
            .notEmpty().withMessage('Source of fund name is required')
            .isLength({max: 50}).withMessage('Source of fund name must not exceed 50 characters')
            .isString().matches(/^[a-zA-Z\s]+$/).withMessage('Source of fund name can only contain alphabets')
        ,
        check('status')
            .trim()
            .notEmpty().withMessage('Status is required')
            .isInt().withMessage('Status must be a number')
            .isIn(['1', '2']).withMessage('Invalid status')
    ],
    expressValidatorMiddleware.catchErrors,
    sourceOfFundController.addSourceOfFund
);

router.get(
    '/list',
    superadminMiddleware.isAuthenticated,
    sourceOfFundController.allSourceOfFunds
);

router.get(
    '/detail',
    superadminMiddleware.isAuthenticated,
    [
        check('id')
            .trim()
            .notEmpty().withMessage('Source of fund ID is required')
            .isInt().withMessage('Source of fund ID must be a number')
    ],
    expressValidatorMiddleware.catchErrors,
    sourceOfFundController.sourceOfFundDetail
);

router.post(
    '/edit',
    superadminMiddleware.isAuthenticated,
    [
        check('id')
            .trim()
            .notEmpty().withMessage('Source of fund ID is required')
            .isInt().withMessage('Source of fund ID must be a number')
        ,
        check('name')
            .trim()
            .notEmpty().withMessage('Source of fund name is required')
            .isLength({max: 50}).withMessage('Source of fund name must not exceed 50 characters')
            .isString().matches(/^[a-zA-Z\s]+$/).withMessage('Source of fund name can only contain alphabets')
        ,
        check('status')
            .trim()
            .notEmpty().withMessage('Status is required')
            .isInt().withMessage('Status must be a number')
            .isIn(['1', '2']).withMessage('Invalid status')
    ],
    expressValidatorMiddleware.catchErrors,
    sourceOfFundController.editSourceOfFund
);

router.post(
    '/delete',
    superadminMiddleware.isAuthenticated,
    [
        check('id')
            .trim()
            .notEmpty().withMessage('Source of fund ID is required')
            .isInt().withMessage('Source of fund ID must be a number')
    ],
    expressValidatorMiddleware.catchErrors,
    sourceOfFundController.deleteSourceOfFund
);

module.exports = router;