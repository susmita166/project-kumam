const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const multer = require('multer');
const upload = multer();
const loginController = require('../../app/controllers/shared/auth/LoginController');
const authMiddleware = require('../../middlewares/multirole_auth');
const expressValidatorMiddleware = require('../../middlewares/expressValidator');

router.post(
    '/login',
    upload.none(),
    [
        check('email')
            .trim()
            .notEmpty().withMessage('Email is required.')
            .isEmail().withMessage('Email is not valid.')
        ,
        check('password')
            .trim()
            .notEmpty().withMessage('Password is required.')
    ],
    expressValidatorMiddleware.catchErrors,
    loginController.authenticate
);

router.post(
    '/validate-token',
    upload.none(),
    authMiddleware.isAuthenticated,
    loginController.validateToken
);

router.post(
    '/logout',
    authMiddleware.isAuthenticated,
    loginController.logout
);

module.exports = router;