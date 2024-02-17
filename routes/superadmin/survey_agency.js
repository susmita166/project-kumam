const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const { check } = require('express-validator');
const surveyAgencyController = require('../../app/controllers/superadmin/master/SurveyAgencyController');
const superadminMiddleware = require('../../middlewares/superadmin');
const expressValidatorMiddleware = require('../../middlewares/expressValidator');

router.post(
    '/add',
    superadminMiddleware.isAuthenticated,
    upload.none(),
    [
        check('name')
            .trim()
            .notEmpty().withMessage('Survey agency name is required')
            .isLength({max: 50}).withMessage('Survey agency name must not exceed 50 characters')
            .isString().matches(/^[a-zA-Z\s]+$/).withMessage('Survey agency name can only contain alphabets')
        ,
        check('address_one')
            .trim()
            .notEmpty().withMessage('Address 1 is required')
            .isLength({max: 300}).withMessage('Address 1 must not exceed 300 characters')
            .isString().matches(/^[a-zA-Z0-9\s:, -]+$/).withMessage('Address 1 can only contain alphabets, integers, ":", "-", and ","')
        ,
        check('address_two')
            .trim()
            .notEmpty().withMessage('Address 2 is required')
            .isLength({max: 300}).withMessage('Address 2 must not exceed 300 characters')
            .isString().matches(/^[a-zA-Z0-9\s:, -]+$/).withMessage('Address 2 can only contain alphabets, integers, ":", "-", and ","')
        ,
        check('zipcode')
            .trim()
            .notEmpty().withMessage('ZipCode is required')
            .isLength({max: 50}).withMessage('ZipCode must not exceed 50 characters')
            .isString().matches(/^[a-zA-Z0-9\s]+$/).withMessage('ZipCode can only contain alphabets and numbers')
        ,
        check('status')
            .trim()
            .notEmpty().withMessage('Status is required')
            .isInt().withMessage('Status must be a number')
            .isIn(['1', '2']).withMessage('Invalid status')
    ],
    expressValidatorMiddleware.catchErrors,
    surveyAgencyController.addSurveyAgency
);

router.get(
    '/list',
    superadminMiddleware.isAuthenticated,
    surveyAgencyController.allSurveyAgencies
);

router.get(
    '/detail',
    superadminMiddleware.isAuthenticated,
    [
        check('id')
            .trim()
            .notEmpty().withMessage('Survey agency ID is required')
            .isInt().withMessage('Survey agency ID must be a number')
    ],
    expressValidatorMiddleware.catchErrors,
    surveyAgencyController.surveyAgencyDetail
);

router.post(
    '/edit',
    superadminMiddleware.isAuthenticated,
    [
        check('id')
            .trim()
            .notEmpty().withMessage('Survey agency ID is required')
            .isInt().withMessage('Survey agency ID must be a number')
        ,
        check('name')
            .trim()
            .notEmpty().withMessage('Survey agency name is required')
            .isLength({max: 50}).withMessage('Survey agency name must not exceed 50 characters')
            .isString().matches(/^[a-zA-Z\s]+$/).withMessage('Survey agency name can only contain alphabets')
        ,
        check('address_one')
            .trim()
            .notEmpty().withMessage('Address 1 is required')
            .isLength({max: 300}).withMessage('Address 1 must not exceed 300 characters')
            .isString().matches(/^[a-zA-Z0-9\s:, -]+$/).withMessage('Address 1 can only contain alphabets, numbers, symbols like ":" and "-"')
        ,
        check('address_two')
            .trim()
            .notEmpty().withMessage('Address 2 is required')
            .isLength({max: 300}).withMessage('Address 2 must not exceed 300 characters')
            .isString().matches(/^[a-zA-Z0-9\s:, -]+$/).withMessage('Address 2 can only contain alphabets, numbers, symbols like ":" and "-"')
        ,
        check('zipcode')
            .trim()
            .notEmpty().withMessage('ZipCode is required')
            .isLength({max: 50}).withMessage('ZipCode must not exceed 50 characters')
            .isString().matches(/^[a-zA-Z0-9\s]+$/).withMessage('ZipCode can only contain alphabets and numbers')
        ,
        check('status')
            .trim()
            .notEmpty().withMessage('Status is required')
            .isInt().withMessage('Status must be a number')
            .isIn(['1', '2']).withMessage('Invalid status')
    ],
    expressValidatorMiddleware.catchErrors,
    surveyAgencyController.editSurveyAgency
);

router.post(
    '/delete',
    superadminMiddleware.isAuthenticated,
    [
        check('id')
            .trim()
            .notEmpty().withMessage('Survey agency ID is required')
            .isInt().withMessage('Survey agency ID must be a number')
    ],
    expressValidatorMiddleware.catchErrors,
    surveyAgencyController.deleteSurveyAgency
);

module.exports = router;