const express = require("express");
const router = express.Router();
const {
	check
} = require("express-validator");
const multer = require("multer");
const upload = multer();
const superadminMiddleware = require("../../middlewares/superadmin");
const expressValidatorMiddleware = require("../../middlewares/expressValidator");
const {
	addtitleHolder,
	titleHolderList,
	updatetitleHolder,
	deletetitleHolder,
	detailsBasedOntitleHoldeer
} = require("../../app/controllers/superadmin/master/TitleHolderController");

router.post(
	"/add",
	upload.none(),
	superadminMiddleware.isAuthenticated,
	[
		check("name")
			.trim()
			.notEmpty()
			.withMessage("Title Holder  Name is required")
			.isLength({
				max: 50
			})
			.withMessage("Title Holder  Name must contain max 255 characters.")
			.matches(/^[a-zA-Z ]*$/)
			.withMessage("Title Holder  Name can only contain alphabets"),
		check("status")
			.trim()
			.notEmpty()
			.withMessage("Status is required")
			.isNumeric()
			.withMessage("Status must be numeric")
			.isIn(["1", "2"])
			.withMessage("Invalid status"),
	],
	expressValidatorMiddleware.catchErrors,
	addtitleHolder
);

router.get('/list', superadminMiddleware.isAuthenticated, titleHolderList)   

router.get("/detail", superadminMiddleware.isAuthenticated, upload.none(), [
	check("id")
		.trim()
		.notEmpty().withMessage("Title Holder  ID is required")
		.isInt().withMessage("Title Holder  ID must be a number"),
], expressValidatorMiddleware.catchErrors, detailsBasedOntitleHoldeer);

router.post(
	"/edit",
	superadminMiddleware.isAuthenticated,
	[
		check("id")
			.trim()
			.notEmpty()
			.withMessage("Title Holder  ID is required")
			.isInt()
			.withMessage("Title Holder  ID must be a number"),
		check("name")
			.trim()
			.notEmpty()
			.withMessage("Title Holder  Name is required")
			.isLength({
				max: 50
			})
			.withMessage("Title Holder  Name must contain max 255 characters.")
			.matches(/^[a-zA-Z ]*$/)
			.withMessage("Title Holder  Name can only contain alphabets"),
		check("status")
			.trim()
			.notEmpty()
			.withMessage("Status is required")
			.isNumeric()
			.withMessage("Status must be numeric")
			.isIn(["1", "2"])
			.withMessage("Invalid status"),
	],
	expressValidatorMiddleware.catchErrors,
	updatetitleHolder
);

router.post(
	"/delete",
	upload.none(),
	superadminMiddleware.isAuthenticated,
	[
		check("id")
			.trim()
			.notEmpty()
			.withMessage("Title Holder  ID is required")
			.isInt()
			.withMessage("Title Holder  ID must be a number"),
	],
	expressValidatorMiddleware.catchErrors,
	deletetitleHolder
);
module.exports = router;