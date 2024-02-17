const express = require("express");
const router = express.Router();
const {
	check
} = require("express-validator");
const multer = require("multer");
const upload = multer();
const {
	addGramPanchayat,
	listOfAllGramPanchayat,
	gramPanchayatDetails,
	updateGramPanchayat,
	deleteGramPanchayat,
} = require("../../app/controllers/superadmin/master/GrampanchayatController");
const superadminMiddleware = require("../../middlewares/superadmin");
const expressValidatorMiddleware = require("../../middlewares/expressValidator");

/*.................Add Gram panchayat Route API..............*/
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
		check("name")
			.trim()
			.notEmpty()
			.withMessage("Gram panchayat name is required")
			.isLength({
				max: 50
			})
			.withMessage("Gram panchayat name must contain max 255 characters.")
			.matches(/^[a-zA-Z ]*$/)
			.withMessage("Gram panchayat name can only contain alphabets"),
		check("gp_code")
			.trim()
			.notEmpty()
			.withMessage("Gram panchayat code is required")
			.isLength({
				max: 50
			})
			.withMessage("Gram panchayat code must contain max 255 characters.")
			.matches(/^[a-zA-Z0-9]*$/)
			.withMessage(
				"Gram panchayat code must contain only alphanumeric characters"
			),
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
	addGramPanchayat
);

/*...............List of Gram panchayat Route API..............*/
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
	],
	expressValidatorMiddleware.catchErrors,
	listOfAllGramPanchayat
);

router.get("/detail", superadminMiddleware.isAuthenticated, upload.none(), [
	check("id")
		.trim()
		.notEmpty()
		.withMessage("Gram panchayat ID is required")
		.isInt()
		.withMessage("Gram panchayat ID must be a number"),
], expressValidatorMiddleware.catchErrors, gramPanchayatDetails);
/*................Update Gram panchayat Route API................*/
router.post(
	"/edit",
	superadminMiddleware.isAuthenticated,
	[
		check("id")
			.trim()
			.notEmpty()
			.withMessage("Gram panchayat ID is required")
			.isInt()
			.withMessage("Gram panchayat must be a number"),
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
		check("name")
			.trim()
			.notEmpty()
			.withMessage("Gram panchayat name is required")
			.isLength({
				max: 50
			})
			.withMessage("Gram panchayat name must contain max 255 characters.")
			.matches(/^[a-zA-Z ]*$/)
			.withMessage("Gram panchayat name can only contain alphabets"),
		check("gp_code")
			.trim()
			.notEmpty()
			.withMessage("Gram panchayat code is required")
			.isLength({
				max: 50
			})
			.withMessage("Gram panchayat code must contain max 255 characters.")
			.matches(/^[a-zA-Z0-9]*$/)
			.withMessage(
				"Gram panchayat code must contain only alphanumeric characters"
			),
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
	updateGramPanchayat
);

router.post(
	"/delete",
	superadminMiddleware.isAuthenticated,
	[
		check("id")
			.trim()
			.notEmpty()
			.withMessage("Gram panchayat ID is required")
			.isInt()
			.withMessage("Gram panchayat ID must be a number"),
	],
	expressValidatorMiddleware.catchErrors,
	deleteGramPanchayat
);

module.exports = router;