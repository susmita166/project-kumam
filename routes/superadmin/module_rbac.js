const express = require('express')
const router = express.Router()
const multer = require("multer");
const upload = multer();
const {
    check
} = require("express-validator");
const superadminMiddleware = require('../../middlewares/superadmin');
const expressValidatorMiddleware = require('../../middlewares/expressValidator');
const moduleRbacController = require('../../app/controllers/superadmin/master/ModuleRbacController')

router.get(
    '/list',
    superadminMiddleware.isAuthenticated,
    upload.none(),
    check('role_id')
        .trim()
        .notEmpty().withMessage('Role ID is required')
        .isInt().withMessage('Role ID must be a valid number'),
    expressValidatorMiddleware.catchErrors,
    moduleRbacController.allModuleRbac
);

router.post(
    '/assign-permissions',
    superadminMiddleware.isAuthenticated,
    upload.none(),
    [
        check('role_id')
            .trim()
            .notEmpty().withMessage('Role ID is required')
            .isInt().withMessage('Role ID must be a valid number'),
        check('access_control')
            .isArray({ min: 1 }).withMessage('Access control data is required, and must be an array with at least one value'),
        check('access_control.*.module_id')
            .trim()
            .notEmpty().withMessage('Module ID in access control is required')
            .isInt().withMessage('Module ID in access control must be a valid number'),
        check('access_control.*.action_ids')
            .isArray({ min: 1 }).withMessage('Action IDs in access control is required, and must be an array with at least one value')
            .custom((value) => {
                if (!Array.isArray(value)) {
                    throw new Error('Action IDs in access control must be an array');
                }
                if (value.some((id) => typeof id !== 'number' || Number.isNaN(id) || id % 1 !== 0)) {
                    throw new Error('Action IDs in access control must be an array of valid numbers');
                }
                return true;
            })
    ],
    expressValidatorMiddleware.catchErrors,
    moduleRbacController.manageModuleRbac
);

module.exports = router;