const express = require('express')
const router = express.Router()
const multer = require("multer");
const upload = multer();
const {
    check
} = require("express-validator");
const superadminMiddleware = require('../../middlewares/superadmin');
const expressValidatorMiddleware = require('../../middlewares/expressValidator');
const moduleActionController = require('../../app/controllers/superadmin/master/ModuleActionController')

router.get(
    '/list',
    superadminMiddleware.isAuthenticated,
    moduleActionController.allActions
);

module.exports = router;