const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();
const {
	check
} = require("express-validator");
const userController = require("../../app/controllers/superadmin/UserController");
const superadminMiddleware = require("../../middlewares/superadmin");
const expressValidatorMiddleware = require("../../middlewares/expressValidator");

router.post(
	'/add',
	superadminMiddleware.isAuthenticated,
	upload.none(),
	[
		check('role_id')
			.trim()
			.notEmpty().withMessage('Role ID is required')
			.isInt().withMessage('Role ID must be a number'),
		check('department_id')
			.trim()
			.notEmpty().withMessage('Department ID is required')
			.isInt().withMessage('Department ID must be a number'),
		check('ulb_id')
			.trim()
			.notEmpty().withMessage('ULB ID is required')
			.isInt().withMessage('ULB ID must be a number'),
		check('first_name')
			.trim()
			.notEmpty().withMessage('First name is required')
			.isLength({
				max: 50
			}).withMessage('First name must not exceed 50 characters')
			.isString().matches(/^[a-zA-Z\s]+$/).withMessage('First name can only contain alphabets'),
		check('last_name')
			.trim()
			.notEmpty().withMessage('Last name is required')
			.isLength({
				max: 50
			}).withMessage('Last name must not exceed 50 characters')
			.isString().matches(/^[a-zA-Z\s]+$/).withMessage('Last name can only contain alphabets'),
		check('email')
			.trim()
			.notEmpty().withMessage('Email is required.')
			.isEmail().withMessage('Email is not valid.')
			.isLength({
				max: 255
			}).withMessage('Email must contain max 255 characters.'),
		check("username")
			.trim()
			.notEmpty().withMessage("Username is required")
			.isLength({ max: 50 }).withMessage("Username must not exceed 50 characters")
			.matches(/^[a-zA-Z0-9_]+$/, "g").withMessage("Username must only contain alphabets, underscores, and numbers"),
		check('password')
			.trim()
			.notEmpty().withMessage('Password is required.')
			.matches('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})').withMessage('Password must be at least 8 characters long, and contain 1 lowercase, 1 uppercase, 1 numeric, and 1 special character.'),
		check('password_confirm')
			.trim()
			.notEmpty().withMessage('Confirm password is required.')
			.matches('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})').withMessage('Confirm password must be at least 8 characters long, and contain 1 lowercase, 1 uppercase, 1 numeric, and 1 special character.')
	],
	expressValidatorMiddleware.catchErrors,
	userController.addUser
);

router.get(
	"/list",
	superadminMiddleware.isAuthenticated,
	upload.none(),
	userController.allUsers
);

router.get(
	"/detail",
	superadminMiddleware.isAuthenticated,
	upload.none(),
	[
		check("user_id")
			.trim()
			.notEmpty()
			.withMessage("User ID is required")
			.isInt()
			.withMessage("User ID must be a number"),
	],
	expressValidatorMiddleware.catchErrors,
	userController.getUserDetail
);

router.post(
	"/edit",
	superadminMiddleware.isAuthenticated,
	upload.none(),
	[
		check("user_id")
			.trim()
			.notEmpty()
			.withMessage("User ID is required")
			.isInt()
			.withMessage("User ID must be a number"),
		check("role_id")
			.trim()
			.notEmpty()
			.withMessage("Role ID is required")
			.isInt()
			.withMessage("Role ID must be a number"),
		check('department_id')
			.trim()
			.notEmpty().withMessage('Department ID is required')
			.isInt().withMessage('Department ID must be a number'),
		check('ulb_id')
			.trim()
			.notEmpty().withMessage('ULB ID is required')
			.isInt().withMessage('ULB ID must be a number'),
		check("first_name")
			.trim()
			.notEmpty()
			.withMessage("First name is required")
			.isLength({
				max: 50
			})
			.withMessage("First name must not exceed 50 characters")
			.isString()
			.matches(/^[a-zA-Z\s]+$/)
			.withMessage("First name can only contain alphabets"),
		check("last_name")
			.trim()
			.notEmpty()
			.withMessage("Last name is required")
			.isLength({
				max: 50
			})
			.withMessage("Last name must not exceed 50 characters")
			.isString()
			.matches(/^[a-zA-Z\s]+$/)
			.withMessage("Last name can only contain alphabets"),
		check("email")
			.trim()
			.notEmpty()
			.withMessage("Email is required.")
			.isEmail()
			.withMessage("Email is not valid.")
			.isLength({
				max: 255
			})
			.withMessage("Email must contain max 255 characters."),
		check("username")
			.trim()
			.notEmpty().withMessage("Username is required")
			.isLength({ max: 50 }).withMessage("Username must not exceed 50 characters")
			.matches(/^[a-zA-Z0-9_]+$/, "g").withMessage("Username must only contain alphabets, underscores, and numbers"),
		check("password")
			.trim()
			.optional()
			.matches("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})")
			.withMessage(
				"Password must be at least 8 characters long, and contain 1 lowercase, 1 uppercase, 1 numeric, and 1 special character."
			),
		check("status")
			.notEmpty()
			.withMessage("Status is required")
			.isNumeric()
			.withMessage("Status must be numeric")
			.isIn(["1", "2"])
			.withMessage("Invalid status"),
	],
	expressValidatorMiddleware.catchErrors,
	userController.editUser
);

router.post(
	"/delete",
	superadminMiddleware.isAuthenticated,
	upload.none(),
	[
		check("user_id")
			.trim()
			.notEmpty()
			.withMessage("User ID is required")
			.isInt()
			.withMessage("User ID must be a number"),
	],
	expressValidatorMiddleware.catchErrors,
	userController.deleteUser
);

module.exports = router;