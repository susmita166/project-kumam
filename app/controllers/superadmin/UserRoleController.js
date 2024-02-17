const UserRole = require("../../models/UserRole");
const Department = require("../../models/Department");
const User = require("../../models/User");
const {
	Op
} = require("sequelize");

const addRole = async (req, res) => {
	/**
	 *
	 * Create a new instance of the UserRole model
	 */
	const userRoleModel = new UserRole();
	/**
	 * Fetch the user role detail from the database based on the provided role name and user details
	 */
	const userRoleDetail = await userRoleModel.fetchRoleDetailByName(
		req.body.role_name,
		req.user_detail
	);
	/**
	 * Check if a user role with the same name already exists, if so, return a 403 status with an error message
	 */
	if (userRoleDetail) {
		return res.status(403).json({
			message: "User role with same name exists.",
		});
	}
	/**
	 * Check that department id is exist or not
	 */
	const {
		department_id
	} = req.body;
	const departmentIDExists = await Department.findOne({
		where: {
			id: department_id,
			status: {
				[Op.ne]: Department.STATUS_DELETED
			}
		},
	});
	if (!departmentIDExists) {
		return res.status(404).json({
			message: "Department not found"
		});
	}
	/**
	 * Create a new user role with the provided name and user details
	 */
	const isRoleAdded = await userRoleModel.createRole(
		req.body.role_name,
		req.body.department_id,
		req.user_detail
	);
	/**
	 * Check if the user role creation was successful, if not, return a 500 status with an error message
	 */
	if (!isRoleAdded) {
		return res.status(500).json({
			message: "Unable to add the user role.",
		});
	}
	/**
	 * Return a JSON response with a success message
	 */
	return res.json({
		message: "User role has been added.",
	});
};

const allRoles = async (req, res) => {
	/**
	 * Create a new instance of the UserRole model
	 */
	const userRoleModel = new UserRole();
	/**
	 * Fetch all user roles from the database and store the result in the roles variable
	 */
	const department_id = req.query.department_id ?
		req.query.department_id :
		null;
	if (department_id) {
		const isDepartmentIDexists = await Department.fetchDepartmentDetailsByID(department_id);
		if (!isDepartmentIDexists) {
			return res.status(404).json({
				message: "Department not found"
			});
		}
	}

	const roles = await userRoleModel.fetchAllRoles(req.user_detail, true, department_id);
	const allDepartments = await Department.fetchAllDepartments();
	const allDepartmentsMappedByID = allDepartments.reduce((acc, department) => {
		acc[department.id] = department;
		return acc;
	}, {});
	roles.forEach((role, index) => {
		const departmentDetails = allDepartmentsMappedByID[role.department_id];
		roles[index].dataValues.department_name = departmentDetails ? departmentDetails.name : null;
	});

	/**
	 * Return a JSON response with the count of roles and the data itself
	 */
	return res.json({
		count: roles.length,
		data: roles,
	});
}

const editRole = async (req, res) => {
	/**
	 * Create a new instance of the UserRole model
	 */
	const userRoleModel = new UserRole();
	/**
	 * Fetch the user role detail from the database based on the provided role ID and user details
	 */
	const roleDetail = await userRoleModel.fetchRoleDetailByID(req.body.role_id);
	/**
	 * Check if the user role detail is not found, return a 404 status with an error message
	 */
	if (!roleDetail) {
		return res.status(404).json({
			message: "User role not found.",
		});
	}
	/**
	 * Fetch the user role detail based on the new role name and user details, then check if a user role with the same name already exists
	 */
	const userRoleDetail = await userRoleModel.fetchRoleDetailByName(
		req.body.role_name,
		req.user_detail
	);
	if (userRoleDetail && userRoleDetail.id !== roleDetail.id) {
		return res.status(403).json({
			message: "User role with same name exists.",
		});
	}
	const {
		department_id
	} = req.body;
	const departmentIDExists = await Department.findOne({
		where: {
			id: department_id,
			status: {
				[Op.ne]: Department.STATUS_DELETED
			}
		},
	});
	if (!departmentIDExists) {
		return res.status(404).json({
			message: "Department not Found"
		});
	}
	/**
	 * Update the user role details with the provided information and user details
	 */
	const isRoleUpdated = await userRoleModel.updateRole(
		req.body.role_id,
		req.body.role_name,
		req.body.department_id,
		req.body.status,
		req.user_detail
	);
	/**
	 * Check if the user role update was successful, if not, return a 500 status with an error message
	 */
	if (!isRoleUpdated) {
		return res.status(500).json({
			message: "Unable to update the user role.",
		});
	}
	await User.update({
		department_id: req.body.department_id
	}, {
		where: {
			role_id: req.body.role_id,
		},
	});
	/***
	 * Return a JSON response with a success message
	 */
	return res.json({
		message: "User role has been updated.",
	});
};

const deleteRole = async (req, res) => {
	/**
	 * Create a new instance of the UserRole model
	 */
	const userRoleModel = new UserRole();
	/**
	 * Fetch the role detail by ID using the userRoleModel
	 */
	const roleDetail = await userRoleModel.fetchRoleDetailByID(req.body.role_id);
	/**
	 * If roleDetail is falsy, return a 404 status with a JSON object containing a message
	 */
	if (!roleDetail) {
		return res.status(404).json({
			message: "User role not found.",
		});
	}
	/**
	 * Delete the role using the userRoleModel and store the result in isRoleDeleted
	 */
	const isRoleDeleted = await userRoleModel.deleteRole(
		req.body.role_id,
		req.user_detail
	);
	/**
	 * If isRoleDeleted is falsy, return a 500 status with a JSON object containing a message
	 */
	if (!isRoleDeleted) {
		return res.status(500).json({
			message: "Unable to delete the user role.",
		});
	}
	/**
	 * If no errors occur, return a JSON object with a message indicating the user role has been deleted
	 */
	return res.json({
		message: "User role has been deleted.",
	});
};

const getRoleDetail = async (req, res) => {
	/**
	 * Create a new instance of the UserRole model
	 */
	const userRoleModel = new UserRole();
	/**
	 * Fetch the role detail by ID using the userRoleModel, with an additional flag for detailed information
	 */
	const roleDetail = await userRoleModel.fetchRoleDetailByID(req.query.role_id, true);
	/**
	 * If roleDetail is falsy, return a 404 status with a JSON object containing a message
	 */
	if (!roleDetail) {
		return res.status(404).json({
			message: "User role not found.",
		});
	}
	/**
	 * Fetch department details based on the department_id in roleDetail
	 */
	const departmentDetails = await Department.fetchDepartmentDetailsByID(roleDetail.department_id);
	const response = {
		...roleDetail.toJSON(),
		department_name: departmentDetails ? departmentDetails.name : null,
	};
	/**
	 * If roleDetail is found, return a JSON object containing the role detail data
	 */
	return res.json({
		data: response,
	});
};

module.exports = {
	addRole,
	allRoles,
	editRole,
	deleteRole,
	getRoleDetail,
};