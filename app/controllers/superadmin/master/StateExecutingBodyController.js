const StateExecutingBody = require('../../../models/StateExecutingBody')
const State = require("../../../models/State")
const Department = require("../../../models/Department");
const {
	Op
} = require('sequelize');
const logger = require('../../../../util/logger');

const addStateExecuting = async (req, res) => {
	try {
		/* create an instance of the State Executing Body model */
		const stateExecutingModel = new StateExecutingBody();
		/* Extract State Executing Body data from the request body */
		const stateExecutingData = req.body;
		/*  Check if a State Executing with the same name already exists */
		const existingStateExecuting = await StateExecutingBody.findOne({
			where: {
				name: stateExecutingData.name,
				status: {
					[Op.ne]: StateExecutingBody.STATUS_DELETED
				}
			}
		});
		if (existingStateExecuting) {
			return res.status(409).json({
				message: "State executing body already exists"
			});
		}
		/* Check if the provided state ID exists in the State model */
		const existingState = await State.findOne({
			where: {
				id: stateExecutingData.state_id,
				status: {
					[Op.ne]: State.STATUS_DELETED
				}
			}
		});
		if (!existingState) {
			return res.status(404).json({
				message: "State not found"
			});
		}
		/* Check if the provided Department ID exists in the Department model */
		const existingDepartment = await Department.findOne({
			where: {
				id: stateExecutingData.department_id,
				status: {
					[Op.ne]: Department.STATUS_DELETED
				}
			}
		});
		if (!existingDepartment) {
			return res.status(404).json({
				message: "Department not found"
			});
		}
		/* Create a new state Executing using the stateExecutingModel instance */
		const isCreated = await stateExecutingModel.addStateExecuting(stateExecutingData, req.user_detail);
		if (!isCreated) {
			return res.status(500).json({
				message: 'Unable to create state executing body'
			});
		}
		/* Return success message if the state Executing creation is successful */
		return res.status(200).json({
			message: "State executing body has been created"
		});
	} catch (error) {
		logger.error(error);
		/* Return an error message if any exception occurs during state Executing creation */
		return res.status(500).json({
			message: "Unable to create state executing body"
		})
	}
}

const stateExecutingList = async (req, res) => {
	/* Check if the provided state_id exists in the State model */
	const existingState = await State.findOne({
		where: {
			id: req.query.state_id,
			status: {
				[Op.ne]: State.STATUS_DELETED
			}
		}
	});
	if (!existingState) {
		return res.status(404).json({
			message: "State not found"
		});
	}
	/* Check if the provided department_id exists in the Department model */
	const existingDepartment = await Department.findOne({
		where: {
			id: req.query.department_id
		}
	});
	if (!existingDepartment) {
		return res.status(404).json({
			message: "Department not found"
		});
	}
	/* Fetch state Executing data based on state_id, department_id, and user details */
	const data = await StateExecutingBody.fetchAllStateExecutingBodies(req.query.state_id, req.query.department_id);
	/* Return a JSON response with the count of state Executing and the data itself */
	return res.json({
		count: data.length,
		data: data
	});
}

const StateExecutingDetails = async (req, res) => {
	try {
		const {
			id
		} = req.query;
		const isStateExecutingIDExists = await StateExecutingBody.findOne({
			where: {
				id: id,
				status: {
					[Op.ne]: StateExecutingBody.STATUS_DELETED
				}
			}
		});
		if (!isStateExecutingIDExists) {
			return res.status(404).json({
				message: "State executing body not found"
			});
		}
		const data = await StateExecutingBody.fetchStateExecutingBodyDetailsByID(id);
		return res.json({
			data: data
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			message: "Unable to fetch detail of the state executing body."
		});
	}
}
const editStateExecuting = async (req, res) => {
	try {
		/* Extract State Executing data from the request body */
		const {
			id,
		} = req.body;
		/* Check if the provided State executing ID exists in the State Executing model */
		const existingStateExecutingID = await StateExecutingBody.findOne({
			where: {
				id: id,
				status: {
					[Op.ne]: StateExecutingBody.STATUS_DELETED
				}
			}
		});
		if (!existingStateExecutingID) {
			return res.status(404).json({
				message: 'State executing body not found'
			});
		}
		const existingState = await State.findOne({
			where: {
				id: req.body.state_id,
				status: {
					[Op.ne]: State.STATUS_DELETED
				}
			}
		});
		if (!existingState) {
			return res.status(404).json({
				message: "State not found"
			});
		}
		/* Check if the provided Department ID exists in the Department model */
		const existingDepartment = await Department.findOne({
			where: {
				id: req.body.department_id,
				status: {
					[Op.ne]: Department.STATUS_DELETED
				}
			}
		});
		if (!existingDepartment) {
			return res.status(404).json({
				message: "Department not found"
			});
		}
		/* Call the editStateExecuting method and update the State Executing details with the provided information and user details */
		const isUpdated = await StateExecutingBody.editStateExecuting(req.body, req.user_detail);
		if (!isUpdated) {
			return res.status(500).json({
				message: 'Unable to update the state executing body'
			});
		}
		/* Return a JSON response with a success message */
		return res.json({
			message: "State executing body has been updated"
		});
	} catch (error) {
		logger.error(error);
		/* Return an error message if any exception occurs during State Executing editing */
		return res.status(500).json({
			message: "Unable to update the state executing body"
		})
	}
}

const deleteStateExecuting = async (req, res) => {
	try {
		/* Extract State Executing data from the request body */
		const {
			id
		} = req.body;
		/* Check if the provided State executing ID exists in the State Executing model */
		const existingStateExecutingID = await StateExecutingBody.findOne({
			where: {
				id: id,
				status: {
					[Op.ne]: StateExecutingBody.STATUS_DELETED
				}
			}
		});
		if (!existingStateExecutingID) {
			return res.status(404).json({
				message: 'State executing body not found'
			});
		}
		/* Call the deleteStateExecuting method to perform the State Executing deletion */
		const isDeleted = await StateExecutingBody.deleteStateExecuting(id, req.user_detail);
		if (!isDeleted) {
			return res.status(500).json({
				message: 'Unable to delete the state executing body'
			});
		}
		/* Return a success message if the State Executing deletion is successful  */
		return res.json({
			message: "State executing body has been deleted"
		})
	} catch (error) {
		/* Return an error message if any exception occurs during state executing deletion */
		return res.status(500).json({
			message: "Unable to delete the state executing body."
		})
	}
}

module.exports = {
	addStateExecuting,
	stateExecutingList,
	editStateExecuting,
	StateExecutingDetails,
	deleteStateExecuting
}