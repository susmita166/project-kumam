const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();
const superadminMasterStatsController = require("../../app/controllers/superadmin/master/MasterStatsController");
const superadminMiddleware = require("../../middlewares/superadmin");

router.get(
	"",
	upload.none(),
	superadminMiddleware.isAuthenticated,
	superadminMasterStatsController.masterStats
);

module.exports = router;