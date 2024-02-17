const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const multer = require("multer");
const upload = multer();
const superadminMiddleware = require('../../middlewares/superadmin');
const expressValidatorMiddleware = require('../../middlewares/expressValidator');
const {
    statelist,
    singleState,
    addState,
    updateState,
    deleteState
} = require('../../app/controllers/superadmin/master/StateController')

router.get('/list', superadminMiddleware.isAuthenticated, upload.none(), statelist)

router.get('/detail', superadminMiddleware.isAuthenticated, upload.none(),
    [
        check('id')
            .trim()
            .notEmpty().withMessage('State ID is required')
            .isInt().withMessage('State ID must be a number')
    ],
    expressValidatorMiddleware.catchErrors, singleState
)

router.post('/add', upload.none(),
    superadminMiddleware.isAuthenticated,
    [
        check('name')
            .trim()
            .notEmpty().withMessage('State name is required.')
            .isLength({
                max: 255
            }).withMessage('State name must contain max 255 characters.')
            .isString().matches(/^[a-zA-Z\s]+$/).withMessage('State name can only contain alphabets'),
        check('code')
            .trim()
            .notEmpty().withMessage('State code is required.')
            .matches(/^[a-zA-Z0-9]+$/).withMessage('State code can only contain numbers and alphabets.'),
        check('status')
            .trim()
            .notEmpty().withMessage('Status is required')
            .isNumeric().withMessage('Status must be numeric')
            .isIn(['1', '2']).withMessage('Invalid status')
    ],
    expressValidatorMiddleware.catchErrors, addState)

router.post('/edit', superadminMiddleware.isAuthenticated, upload.none(),
    [
        check('id')
            .trim()
            .notEmpty().withMessage('State ID is required')
            .isInt().withMessage('state ID must be a number'),
        check('name')
            .trim()
            .notEmpty().withMessage('State name is required.')
            .isLength({
                max: 255
            }).withMessage('State name must contain max 255 characters.')
            .isString().matches(/^[a-zA-Z\s]+$/).withMessage('State name can only contain alphabets'),
        check('code')
            .trim()
            .notEmpty().withMessage('State code is required.')
            .matches(/^[a-zA-Z0-9]+$/).withMessage('State code can only contain numbers and alphabets.'),
        check('status')
            .trim()
            .notEmpty().withMessage('Status is required')
            .isNumeric().withMessage('Status must be numeric')
            .isIn(['1', '2']).withMessage('Invalid status')
    ], expressValidatorMiddleware.catchErrors, updateState
)

router.post('/delete', superadminMiddleware.isAuthenticated, upload.none(),
    [
        check('id')
            .trim()
            .notEmpty().withMessage('State ID is required')
            .isInt().withMessage('state ID must be a number')
    ], expressValidatorMiddleware.catchErrors, deleteState
)

module.exports = router