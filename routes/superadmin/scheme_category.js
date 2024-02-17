const express = require('express');
const router = express.Router();
const multer = require("multer");
const upload = multer();
const {
    check
} = require("express-validator");
const superadminMiddleware = require('../../middlewares/superadmin');
const expressValidatorMiddleware = require('../../middlewares/expressValidator');
const {
    addSchemeCategory,
    schemeCategoryList,
    schemeCategoryDetail,
    editSchemeCategory,
    deleteSchemeCategory
} = require('../../app/controllers/superadmin/master/SchemeCategoryController')

router.get('/list', superadminMiddleware.isAuthenticated, upload.none(), schemeCategoryList)

router.get('/detail', superadminMiddleware.isAuthenticated, upload.none(),
    [
        check('id')
            .trim()
            .notEmpty().withMessage('Scheme category ID is required')
            .isInt().withMessage('Scheme category ID must be a number')
    ], expressValidatorMiddleware.catchErrors, schemeCategoryDetail)

router.post('/add', superadminMiddleware.isAuthenticated, upload.none(),
    [
        check('name')
            .trim()
            .notEmpty().withMessage('Scheme category name is required.')
            .isLength({
                max: 255
            }).withMessage('Scheme category name must contain max 255 characters.')
            .isString().matches(/^[a-zA-Z0-9\s\-]+$/).withMessage('Scheme category name can only contain alphabets, numbers, spaces, and hyphens'),
        check('status')
            .trim()
            .notEmpty().withMessage('Status is required')
            .isNumeric().withMessage('Status must be numeric')
            .isIn(['1', '2']).withMessage('Invalid status')
    ], expressValidatorMiddleware.catchErrors, addSchemeCategory)

router.post('/edit', superadminMiddleware.isAuthenticated, upload.none(),
    [
        check('id')
            .trim()
            .notEmpty().withMessage('Scheme category ID is required')
            .isInt().withMessage('Scheme category ID must be a number'),
            check('name')
                .trim()
                .notEmpty().withMessage('Scheme category name is required.')
                .isLength({
                    max: 255
                }).withMessage('Scheme category name must contain max 255 characters.')
                .isString().matches(/^[a-zA-Z0-9\s\-]+$/).withMessage('Scheme category name can only contain alphabets, numbers, spaces, and hyphens'),
            check('status')
            .trim()
            .notEmpty().withMessage('Status is required')
            .isNumeric().withMessage('Status must be numeric')
            .isIn(['1', '2']).withMessage('Invalid status')
    ], expressValidatorMiddleware.catchErrors, editSchemeCategory)

router.post('/delete', superadminMiddleware.isAuthenticated, upload.none(),
    [
        check('id')
            .notEmpty().withMessage('Scheme category ID is required')
            .isInt().withMessage('Scheme category ID must be a number')
    ], expressValidatorMiddleware.catchErrors, deleteSchemeCategory)

module.exports = router