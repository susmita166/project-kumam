const Department = require('../../../models/Department')
const {
	Op
} = require('sequelize');

const addDepartment = async (req, res) => {
	/* create an instance of the Department model */
	const departmentModel = new Department()
	/* Extract department data from the request body */
	const departmentData = req.body;
	/*  Check if a department with the same name already exists */
	const existingDepartmentName = await Department.findOne({
		where: {
			name: departmentData.name,
			status: {
				[Op.ne]: Department.STATUS_DELETED
			}
		}
	});
	if (existingDepartmentName) {
		return res.status(409).json({
			message: "Department already exists"
		});
	}
	/* Create a new department using the departmentModel instance */
	const isCreated = await departmentModel.addDepartment(req.body.name, req.body.status, req.user_detail);
	if (!isCreated) {
		return res.status(500).json({
			message: 'Unable to create department'
		});
	}
	/* Return success message if the Department creation is successful */
	return res.json({
		message: "Department has been created"
	})
}

const departmentList = async (req, res) => {
	/* Call the departmentList method to fetch a list of departments */
	const data = await Department.fetchAllDepartments();
	/* Return a JSON response with the count of department and the data itself */
	return res.json({
		count: data.length,
		data: data
	});
};

const departmentDetail = async (req, res) => {
	/* Call the departmentDetails method to fetch details of a specific department */
	const data = await Department.fetchDepartmentDetailsByID(req.query.id);
	/* Return a 404 status if no department is found with the provided id */
	if (!data) {
		return res.status(404).json({
			message: "Department not found"
		});
	}
	/* Return the fetched department details */
	return res.json({
		data: data
	});
};

const editDepartment = async (req, res) => {
	/* Extract the department ID from the request body */
	const {
		id
	} = req.body;
	/* Check if the provided Department ID exists in the Department model */
	const existingDepartment = await Department.findOne({
		where: {
			id: id,
			status: {
				[Op.ne]: Department.STATUS_DELETED
			}
		}
	});
	if (!existingDepartment) {
		return res.status(404).json({
			message: 'Department not found.'
		});
	}
	/* update the Department details with the provided information and user details */
	const isUpdated = await Department.editDepartment(req.body, req.user_detail);
	if (!isUpdated) {
		return res.status(500).json({
			message: 'Unable to update the department'
		});
	}
	/* Return a JSON response with a success message */
	return res.json({
		message: "Department has been updated"
	})
}

const deleteDepartment = async (req, res) => {
	/* Extract the department ID from the request body */
	const {
		id
	} = req.body;
	/* Check if the provided Department ID exists in the Department model */
	const existingDepartment = await Department.findOne({
		where: {
			id: id,
			status: {
				[Op.ne]: Department.STATUS_DELETED
			}
		}
	});
	if (!existingDepartment) {
		return res.status(404).json({
			message: 'Department not found.'
		});
	}
	/* Call the deleteDepartment method to perform the Department deletion */
	const isDeleted = await Department.deleteDepartment(id, req.user_detail);
	if (!isDeleted) {
		return res.status(500).json({
			message: 'Unable to delete the department'
		});
	}
	/* Return a success message if the Department deletion is successful  */
	return res.json({
		message: "Department has been deleted"
	});
}

module.exports = {
	addDepartment,
	departmentList,
	departmentDetail,
	editDepartment,
	deleteDepartment
};