const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const { check } = require('express-validator');
const financialYearController = require('../../app/controllers/superadmin/master/FinancialYearController');
const superadminMiddleware = require('../../middlewares/superadmin');
const expressValidatorMiddleware = require('../../middlewares/expressValidator');

router.post(
    '/add',
    superadminMiddleware.isAuthenticated,
    upload.none(),
    [
        check('name')
            .trim()
            .notEmpty().withMessage('Financial year is required')
            .isLength({max: 9}).withMessage('Financial year must not exceed 9 characters')
            .isString().matches(/^\d{4}-\d{4}$/).withMessage('Financial year must be in the format "0000-9999"')
        ,
        check('status')
            .trim()
            .notEmpty().withMessage('Status is required')
            .isInt().withMessage('Status must be a number')
            .isIn(['1', '2']).withMessage('Invalid status')
    ],
    expressValidatorMiddleware.catchErrors,
    financialYearController.addFinancialYear
);

router.get(
    '/list',
    superadminMiddleware.isAuthenticated,
    financialYearController.allFinancialYears
);

router.get(
    '/detail',
    superadminMiddleware.isAuthenticated,
    [
        check('id')
            .trim()
            .notEmpty().withMessage('Financial year ID is required')
            .isInt().withMessage('Financial year ID must be a number')
    ],
    expressValidatorMiddleware.catchErrors,
    financialYearController.financialYearDetail
);

router.post(
    '/edit',
    superadminMiddleware.isAuthenticated,
    [
        check('id')
            .trim()
            .notEmpty().withMessage('Financial year ID is required')
            .isInt().withMessage('Financial year ID must be a number')
        ,
        check('name')
            .trim()
            .notEmpty().withMessage('Financial year is required')
            .isLength({max: 9}).withMessage('Financial year must not exceed 9 characters')
            .isString().matches(/^\d{4}-\d{4}$/).withMessage('Financial year must be in the format "0000-9999"')
        ,
        check('status')
            .trim()
            .notEmpty().withMessage('Status is required')
            .isInt().withMessage('Status must be a number')
            .isIn(['1', '2']).withMessage('Invalid status')
    ],
    expressValidatorMiddleware.catchErrors,
    financialYearController.editFinancialYear
);

router.post(
    '/delete',
    superadminMiddleware.isAuthenticated,
    [
        check('id')
            .trim()
            .notEmpty().withMessage('Financial year ID is required')
            .isInt().withMessage('Financial year ID must be a number')
    ],
    expressValidatorMiddleware.catchErrors,
    financialYearController.deleteFinancialYear
);

module.exports = router;