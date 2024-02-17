const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const { check } = require('express-validator');
const sectorController = require('../../app/controllers/superadmin/master/SectorController');
const superadminMiddleware = require('../../middlewares/superadmin');
const expressValidatorMiddleware = require('../../middlewares/expressValidator');

router.post(
    '/add',
    superadminMiddleware.isAuthenticated,
    upload.none(),
    [
        check('name')
            .trim()
            .notEmpty().withMessage('Sector name is required')
            .isLength({max: 50}).withMessage('Sector name must not exceed 50 characters')
            .isString().matches(/^[a-zA-Z\s]+$/).withMessage('Sector name can only contain alphabets')
        ,
        check('status')
            .trim()
            .notEmpty().withMessage('Status is required')
            .isInt().withMessage('Status must be a number')
            .isIn(['1', '2']).withMessage('Invalid status')
    ],
    expressValidatorMiddleware.catchErrors,
    sectorController.addSector
);

router.get(
    '/list',
    superadminMiddleware.isAuthenticated,
    sectorController.allSectors
);

router.get(
    '/detail',
    superadminMiddleware.isAuthenticated,
    [
        check('id')
            .trim()
            .notEmpty().withMessage('Sector ID is required')
            .isInt().withMessage('Sector ID must be a number')
    ],
    expressValidatorMiddleware.catchErrors,
    sectorController.sectorDetail
);

router.post(
    '/edit',
    superadminMiddleware.isAuthenticated,
    [
        check('id')
            .trim()
            .notEmpty().withMessage('Sector ID is required')
            .isInt().withMessage('Sector ID must be a number')
        ,
        check('name')
            .trim()
            .notEmpty().withMessage('Sector name is required')
            .isLength({max: 50}).withMessage('Sector name must not exceed 50 characters')
            .isString().matches(/^[a-zA-Z\s]+$/).withMessage('Sector name can only contain alphabets')
        ,
        check('status')
            .trim()
            .notEmpty().withMessage('Status is required')
            .isInt().withMessage('Status must be a number')
            .isIn(['1', '2']).withMessage('Invalid status')
    ],
    expressValidatorMiddleware.catchErrors,
    sectorController.editSector
);

router.post(
    '/delete',
    superadminMiddleware.isAuthenticated,
    [
        check('id')
            .trim()
            .notEmpty().withMessage('Sector ID is required')
            .isInt().withMessage('Sector ID must be a number')
    ],
    expressValidatorMiddleware.catchErrors,
    sectorController.deleteSector
);

module.exports = router;