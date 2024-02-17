const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const { check } = require('express-validator');
const accountController = require('../../app/controllers/superadmin/AccountController');
const superadminMiddleware = require('../../middlewares/superadmin');
const expressValidatorMiddleware = require('../../middlewares/expressValidator');

router.post(
    '/update-password',
    superadminMiddleware.isAuthenticated,
    upload.none(),
    [
        check('old_password')
            .notEmpty().withMessage('Old password is required')
        ,
        check('new_password')
            .notEmpty().withMessage('New password is required')
            .matches('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})').withMessage('New password must be at least 8 characters long, and contain 1 lowercase, 1 uppercase, 1 numeric, and 1 special character.')
        ,
        check('new_password_confirm')
            .notEmpty().withMessage('Confirm new password is required')
            .matches('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})').withMessage('Confirm new password must be at least 8 characters long, and contain 1 lowercase, 1 uppercase, 1 numeric, and 1 special character.')
        ,
    ],
    expressValidatorMiddleware.catchErrors,
    accountController.updatePassword
);

router.post(
    '/active-devices',
    superadminMiddleware.isAuthenticated,
    upload.none(),
    accountController.activeDevices
);

router.post(
    '/remove-device',
    superadminMiddleware.isAuthenticated,
    upload.none(),
    [
        check('token_id')
            .notEmpty().withMessage('Token ID is required')
    ],
    expressValidatorMiddleware.catchErrors,
    accountController.removeDevice
);

module.exports = router;