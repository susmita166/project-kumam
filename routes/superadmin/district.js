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
	addDistrict,
	getAllDistricts,
	updateDistricts,
	deleteDistrict,
	detailDistrict
} = require("../../app/controllers/superadmin/master/DistrictController");

/*............Add a District Route.............*/
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
		check("name")
			.trim()
			.notEmpty()
			.withMessage("District name is required")
			.isLength({
				max: 50
			})
			.withMessage("District name must contain max 255 characters.")
			.matches(/^[a-zA-Z ]*$/)
			.withMessage("District name can only contain alphabets"),
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
	addDistrict
);

/*............Get All Districts Route...............*/
router.get(
	"/list",
	superadminMiddleware.isAuthenticated,
	[
		check("state_id")
			.trim()
			.isInt()
			.withMessage("State ID must be a number")
			.optional()
	],
	expressValidatorMiddleware.catchErrors,
	getAllDistricts
);
/*..............Detailed District...............*/
router.get(
	"/detail",
	superadminMiddleware.isAuthenticated,
	[
		check("id")
			.trim()
			.notEmpty()
			.withMessage("District ID is required")
			.isInt()
			.withMessage("District ID must be a number"),
	],
	expressValidatorMiddleware.catchErrors,
	detailDistrict
);

/*............Update a Single District Route............*/
router.post(
	"/edit",
	superadminMiddleware.isAuthenticated,
	upload.none(),
	[
		check("id")
			.trim()
			.notEmpty()
			.withMessage("District ID is required")
			.isInt()
			.withMessage("District ID must be a number"),
		check("state_id")
			.trim()
			.notEmpty()
			.withMessage("State ID is required")
			.isInt()
			.withMessage("State ID must be a number"),
		check("name")
			.trim()
			.notEmpty()
			.withMessage("District is required")
			.isLength({
				max: 50
			})
			.withMessage("District name must contain max 255 characters.")
			.matches(/^[a-zA-Z ]*$/)
			.withMessage("District name can only contain alphabets"),
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
	updateDistricts
);

/*.............Delete a single District Route............... */
router.post(
	"/delete",
	superadminMiddleware.isAuthenticated,
	upload.none(),
	[
		check("id")
			.trim()
			.notEmpty()
			.withMessage("District ID is required")
			.isInt()
			.withMessage("District ID must be a number"),
	],
	expressValidatorMiddleware.catchErrors,
	deleteDistrict
);
module.exports = router;