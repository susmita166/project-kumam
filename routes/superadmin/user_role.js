const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const { check, header, validationResult } = require('express-validator');
const userRoleController = require('../../app/controllers/superadmin/UserRoleController');
const superadminMiddleware = require('../../middlewares/superadmin');
const expressValidatorMiddleware = require('../../middlewares/expressValidator');

router.post(
    '/add',
    superadminMiddleware.isAuthenticated,
    upload.none(),
    [
        check('role_name')
            .trim()
            .notEmpty().withMessage('Role name is required')
            .isLength({max: 50}).withMessage('Role name must not exceed 50 characters')
            .isString().matches(/^[a-zA-Z0-9\s\-]+$/).withMessage('Role name can only contain alphabets, numbers, spaces, and hyphens')
        ,
        check('department_id')
            .trim()
            .notEmpty().withMessage('Department ID is required')
            .isInt().withMessage('Department ID must be a number')
    ],
    expressValidatorMiddleware.catchErrors,
    userRoleController.addRole
);

router.get(
    '/list',
    superadminMiddleware.isAuthenticated,
    upload.none(),
    userRoleController.allRoles
);

router.post(
    '/edit',
    superadminMiddleware.isAuthenticated,
    upload.none(),
    [
        check('role_id')
            .notEmpty().withMessage('Role ID is required')
            .isInt().withMessage('Role ID must be a number')
        ,
        check('department_id')
            .notEmpty().withMessage('Department ID is required')
            .isInt().withMessage('Department ID must be a number'),
        check('role_name')
            .notEmpty().withMessage('Role name is required')
            .isLength({max: 50}).withMessage('Role name must not exceed 50 characters')
            .isString().matches(/^[a-zA-Z0-9\s\-]+$/).withMessage('Role name can only contain alphabets, numbers, spaces, and hyphens')
        ,
        check('status')
            .notEmpty().withMessage('Status is required')
            .isNumeric().withMessage('Status must be numeric')
            .isIn(['1', '2']).withMessage('Invalid status')
    ],
    expressValidatorMiddleware.catchErrors,
    userRoleController.editRole
);

router.get(
    '/detail',
    superadminMiddleware.isAuthenticated,
    upload.none(),
    [
        check('role_id')
            .notEmpty().withMessage('Role ID is required')
            .isInt().withMessage('Role ID must be a number')
    ],
    expressValidatorMiddleware.catchErrors,
    userRoleController.getRoleDetail
);

router.post(
    '/delete',
    superadminMiddleware.isAuthenticated,
    upload.none(),
    [
        check('role_id')
            .notEmpty().withMessage('Role ID is required')
            .isInt().withMessage('Role ID must be a number')
        ,
    ],
    expressValidatorMiddleware.catchErrors,
    userRoleController.deleteRole
);

module.exports = router;