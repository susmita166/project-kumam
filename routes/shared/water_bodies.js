const express = require('express')
const router = express.Router()
const { check } = require('express-validator')
const multer = require("multer");
const upload = multer();
const multiRoleMiddleware = require('../../middlewares/multirole_auth')
const expressValidatorMiddleware = require('../../middlewares/expressValidator');
const { addWaterBodies, waterBodiesList, waterBodiesDetail, editWaterBodies, deleteWaterBodies} = require("../../app/controllers/shared/module/WaterBodiesController")

router.post('/add',multiRoleMiddleware.isAuthenticated,upload.none(),[
    check('district_id')
    .trim()
    .notEmpty().withMessage('District ID is required')
    .isInt().withMessage('District ID must be a number'),
    check('scheme_id')
    .trim()
    .notEmpty().withMessage('Scheme ID is required')
    .isInt().withMessage('Scheme ID must be a number'),
    check('ulb_id')
    .trim()
    .notEmpty().withMessage('ULB ID is required')
    .isInt().withMessage('ULB ID must be a number'),
    check('name')
    .trim()
    .notEmpty()
    .withMessage("Water body Name is required")
    .isLength({max: 50}).withMessage("Name must contain max 255 characters.")
    .matches(/^[a-zA-Z ]*$/).withMessage("Name can only contain alphabets"),
    check('latitude')
    .trim()
    .notEmpty()
    .withMessage("Latitude is required"),
    check('longitude')
    .trim()
    .notEmpty()
    .withMessage("Longitude is required"),
    check('category_id')
    .trim()
    .notEmpty().withMessage('Category ID is required')
    .isInt().withMessage('Category ID must be a number'),
    check('area_acres')
    .trim()
    .notEmpty()
    .withMessage("Area acres is required"),
    check('title_holder_id')
    .trim()
    .notEmpty().withMessage('Title holder ID is required')
    .isInt().withMessage('Title holder ID must be a number'),
    check('ror_file_name')
    .trim()
    .notEmpty()
    .withMessage("File is required"),
    check('previously_rejuvenated')
    .trim()
    .notEmpty()
    .withMessage("Previously rejuvenated is required"),
    check('status')
    .trim()
    .notEmpty().withMessage('Status is required')
    .isNumeric().withMessage('Status must be numeric')
    .isIn(['1', '2']).withMessage('Invalid status')
],expressValidatorMiddleware.catchErrors,addWaterBodies)

router.get('/list', multiRoleMiddleware.isAuthenticated, upload.none(),expressValidatorMiddleware.catchErrors,waterBodiesList)

router.get('/detail', multiRoleMiddleware.isAuthenticated,upload.none(),[
	check('id')
        .trim()
        .notEmpty().withMessage('Water body ID is required')
        .isInt().withMessage('Water body ID must be a number')
],expressValidatorMiddleware.catchErrors,waterBodiesDetail)

router.post('/edit', multiRoleMiddleware.isAuthenticated,upload.none(),[
    check('id')
        .trim()
        .notEmpty().withMessage('Water body ID is required')
        .isInt().withMessage('Water body ID must be a number'),
    check('district_id')
    .trim()
    .notEmpty().withMessage('District ID is required')
    .isInt().withMessage('District ID must be a number'),
    check('scheme_id')
    .trim()
    .notEmpty().withMessage('Scheme ID is required')
    .isInt().withMessage('Scheme ID must be a number'),
    check('ulb_id')
    .trim()
    .notEmpty().withMessage('ULB ID is required')
    .isInt().withMessage('ULB ID must be a number'),
    check('name')
    .trim()
    .notEmpty()
    .withMessage("Water body Name is required")
    .isLength({max: 50}).withMessage("Name must contain max 255 characters.")
    .matches(/^[a-zA-Z ]*$/).withMessage("Name can only contain alphabets"),
    check('latitude')
    .trim()
    .notEmpty()
    .withMessage("Latitude is required"),
    check('longitude')
    .trim()
    .notEmpty()
    .withMessage("Longitude is required"),
    check('category_id')
    .trim()
    .notEmpty().withMessage('Category ID is required')
    .isInt().withMessage('Category ID must be a number'),
    check('area_acres')
    .trim()
    .notEmpty()
    .withMessage("Area acres is required"),
    check('title_holder_id')
    .trim()
    .notEmpty().withMessage('Title holder ID is required')
    .isInt().withMessage('Title holder ID must be a number'),
    check('ror_file_name')
    .trim()
    .notEmpty()
    .withMessage("File is required"),
    check('previously_rejuvenated')
    .trim()
    .notEmpty()
    .withMessage("Previously rejuvenated is required"),
    check('status')
    .trim()
    .notEmpty().withMessage('Status is required')
    .isNumeric().withMessage('Status must be numeric')
    .isIn(['1', '2']).withMessage('Invalid status')
],expressValidatorMiddleware.catchErrors,editWaterBodies)

router.post('/delete', multiRoleMiddleware.isAuthenticated,upload.none(),[
    check('id')
    .trim()
    .notEmpty().withMessage('Water body ID is required')
    .isInt().withMessage('Water body ID must be a number')
],expressValidatorMiddleware.catchErrors,deleteWaterBodies)

module.exports = router;