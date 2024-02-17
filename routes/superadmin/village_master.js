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
	addVillage,
	listOfVillages,
	updateVillage,
	deleteVillage,
	villageDetails
} = require("../../app/controllers/superadmin/master/VillagemasterController");

router.post(
	"/add",
	upload.none(),
	superadminMiddleware.isAuthenticated,
	[
		check("state_id")
			.trim()
			.notEmpty()
			.withMessage("State ID is required")
			.isInt()
			.withMessage("State ID must be a number"),
		check("district_id")
			.trim()
			.notEmpty()
			.withMessage("District ID is required")
			.isInt()
			.withMessage("District ID must be a number"),
		check("block_id")
			.trim()
			.notEmpty()
			.withMessage("Block ID is required")
			.isInt()
			.withMessage("Block ID must be a number"),
		check("gram_panchayat_id")
			.trim()
			.notEmpty()
			.withMessage("Gram panchayat ID is required")
			.isInt()
			.withMessage("Gram panchayat ID must be a number"),
		check("name")
			.trim()
			.notEmpty()
			.withMessage("Village Name is required")
			.isLength({
				max: 50
			})
			.withMessage("Village Name must contain max 255 characters.")
			.matches(/^[a-zA-Z ]*$/)
			.withMessage("Village Name can only contain alphabets"),
		check("status")
			.trim()
			.notEmpty()
			.withMessage("Status is required")
			.isNumeric()
			.withMessage("Status must be numeric")
			.isIn(["1", "2"])
			.withMessage("Invalid status"),
		check("remarks").notEmpty().withMessage("Remarks is required"),
	],
	expressValidatorMiddleware.catchErrors,
	addVillage
);

router.get(
	"/list",
	superadminMiddleware.isAuthenticated,
	[
		check("state_id")
			.trim()
			.notEmpty()
			.withMessage("State ID is required")
			.isInt()
			.withMessage("State ID must be a number"),
		check("district_id")
			.trim()
			.notEmpty()
			.withMessage("District ID is required")
			.isInt()
			.withMessage("District ID must be a number"),
		check("block_id")
			.trim()
			.notEmpty()
			.withMessage("Block ID is required")
			.isInt()
			.withMessage("Block ID must be a number"),
		check("gram_panchayat_id")
			.trim()
			.notEmpty()
			.withMessage("Gram panchayat ID is required")
			.isInt()
			.withMessage("Gram panchayat ID must be a number"),
	],
	expressValidatorMiddleware.catchErrors,
	listOfVillages
);

router.get("/detail", superadminMiddleware.isAuthenticated, upload.none(), [
	check("id")
		.trim()
		.notEmpty().withMessage("Village ID is required")
		.isInt().withMessage("Village ID must be a number"),
], expressValidatorMiddleware.catchErrors, villageDetails);

router.post(
	"/edit",
	superadminMiddleware.isAuthenticated,
	[
		check("id")
			.trim()
			.notEmpty()
			.withMessage("Village ID is required")
			.isInt()
			.withMessage("Village ID must be a number"),
		check("state_id")
			.trim()
			.notEmpty()
			.withMessage("State ID is required")
			.isInt()
			.withMessage("State ID must be a number"),
		check("district_id")
			.trim()
			.notEmpty()
			.withMessage("District ID is required")
			.isInt()
			.withMessage("District ID must be a number"),
		check("block_id")
			.trim()
			.notEmpty()
			.withMessage("Block ID is required")
			.isInt()
			.withMessage("Block ID must be a number"),
		check("gram_panchayat_id")
			.trim()
			.notEmpty()
			.withMessage("Gram panchayat ID is required")
			.isInt()
			.withMessage("Gram panchayat ID must be a number"),
		check("name")
			.trim()
			.notEmpty()
			.withMessage("Village Name is required")
			.isLength({
				max: 50
			})
			.withMessage("Village Name must contain max 255 characters.")
			.matches(/^[a-zA-Z ]*$/)
			.withMessage("Village Name can only contain alphabets"),
		check("remarks")
			.trim()
			.notEmpty()
			.withMessage("Remarks is required"),
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
	updateVillage
);

router.post(
	"/delete",
	upload.none(),
	superadminMiddleware.isAuthenticated,
	[
		check("id")
			.trim()
			.notEmpty()
			.withMessage("Village ID is required")
			.isInt()
			.withMessage("Village ID must be a number"),
	],
	expressValidatorMiddleware.catchErrors,
	deleteVillage
);
module.exports = router;