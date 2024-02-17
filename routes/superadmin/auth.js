const express = require('express');
const router = express.Router();
const { check, header, validationResult } = require('express-validator');
const multer = require('multer');
const upload = multer();
const signupController = require('../../app/controllers/superadmin/auth/SignupController');
const loginController = require('../../app/controllers/superadmin/auth/LoginController');
const superadminMiddleware = require('../../middlewares/superadmin');
const expressValidatorMiddleware = require('../../middlewares/expressValidator');

router.post(
    '/signup',
    upload.none(),
    [
        check('name')
            .notEmpty().withMessage('Name is required.')
            .isString().matches(/^[a-zA-Z\s]+$/).withMessage('Name can only contain alphabets')
            .isLength({max: 255}).withMessage('Name must contain max 255 characters.')
        ,
        check('email')
            .notEmpty().withMessage('Email is required.')
            .isEmail().withMessage('Email is not valid.')
            .isLength({max: 255}).withMessage('Email must contain max 255 characters.')
        ,
        check('password')
            .notEmpty().withMessage('Password is required.')
            .matches('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})').withMessage('Password must be at least 8 characters long, and contain 1 lowercase, 1 uppercase, 1 numeric, and 1 special character.')
        ,
        check('password_confirm')
            .notEmpty().withMessage('Confirm password is required.')
            .matches('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})').withMessage('Confirm password must be at least 8 characters long, and contain 1 lowercase, 1 uppercase, 1 numeric, and 1 special character.')
    ],
    expressValidatorMiddleware.catchErrors,
    signupController.createAccount
);

router.post(
    '/login',
    upload.none(),
    [
        check('email')
            .notEmpty().withMessage('Email is required.')
            .isEmail().withMessage('Email is not valid.')
        ,
        check('password')
            .notEmpty().withMessage('Password is required.')
    ],
    expressValidatorMiddleware.catchErrors,
    loginController.authenticate
);

router.post(
    '/validate-token',
    upload.none(),
    superadminMiddleware.isAuthenticated,
    loginController.validateToken
);

router.post(
    '/logout',
    upload.none(),
    superadminMiddleware.isAuthenticated,
    loginController.logout
);

module.exports = router;