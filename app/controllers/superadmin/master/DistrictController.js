const District = require("../../../models/District");
const State = require("../../../models/State");
const logger = require("../../../../util/logger");
const {
	Op
} = require("sequelize");
const { setAsync, getAsync } = require('../../../../util/redis');

/*..................Adding District Data API.................... */
const addDistrict = async (req, res) => {
	try {
		// Create a new instance of District model
		const districtModel = new District();
		// Extract state_id from request body
		const {
			state_id
		} = req.body;
		// Copy entire request body into districtData variable
		const districtData = req.body;
		// Check if the provided state_id exists in the State model
		const isStateIDExists = await State.findOne({
			where: {
				id: state_id,
				status: {
					[Op.ne]: State.STATUS_DELETED
				}
			}
		});
		if (!isStateIDExists) {
			return res.status(404).json({
				message: "State not found"
			});
		}
		// Check if a district with the same name already exists
		const existingDistrictData = await District.findOne({
			where: {
				name: districtData.name,
				status: {
					[Op.ne]: District.STATUS_DELETED
				}
			},
		});
		if (existingDistrictData) {
			return res.status(409).json({
				message: "District already exists"
			});
		}
		// Add the district using the districtModel
		const isCreated = await districtModel.addDistrict(
			districtData,
			req.user_detail,
			req.body.status
		);
		if (!isCreated) {
			return res.status(500).json({
				message: 'Unable to create district'
			});
		}
		// Send a success response
		return res.json({
			message: "District has been created",
		});
	} catch (error) {
		logger.error(error);
		return res.status(500).json({
			message: "Unable to create district"
		});
	}
};

/*..................List of District Data API....................*/
const getAllDistricts = async (req, res) => {
	try {
		const stateID = req.query.state_id;
		if (stateID) {
			const isStateIDExists = await State.findOne({
				where: {
					id: stateID,
					status: {
						[Op.ne]: State.STATUS_DELETED
					}
				}
			});
			if (!isStateIDExists) {
				return res.status(404).json({
					message: "State not found."
				});
			}
		}
		try {
			let districts = getAsync('all_districts' + ((stateID) ? '_state_' + stateID : ''))
			districts = JSON.parse(districts)
			return res.json({
				cache: true,
				count: districts.length,
				data: districts
			});
		} catch (err) {
			logger.error(err.toString());
		}

		const districts = await District.fetchAllDistricts(stateID);
		const allStates = await State.fetchAllStates();
		const allStatesMappedByID = {};
		allStates.forEach(item => {
			allStatesMappedByID[item.id] = item;
		});

		districts.forEach((item, index) => {
			const stateDetail = (allStatesMappedByID[item.state_id]) ? allStatesMappedByID[item.state_id] : null;
			districts[index].dataValues.state_name = (stateDetail) ? stateDetail.name : null;
		});

		if (!stateID) {
			setAsync('all_districts', JSON.stringify(districts));
		} else {
			setAsync('all_districts_state_' + stateID, JSON.stringify(districts));
		}
		
		return res.json({
			count: districts.length,
			data: districts
		});
	} catch (error) {
		logger.error(error);
		return res
			.status(500)
			.json({
				message: "Unable to fetch the list of districts."
			});
	}
};

const detailDistrict = async (req, res) => {
	try {
		const {
			id
		} = req.query;
		const data = await District.fetchDistrictDetailsByID(id);

		if (data) {
			const stateDetail = await State.fetchStateDetailsByID(data.state_id);
			data.dataValues.state_name = null;
			if (stateDetail) {
				data.dataValues.state_name = stateDetail.name;
			}
		}

		return res.json({
			data: data
		});
	} catch (error) {
		console.log(error);
		return res
			.status(500)
			.json({
				message: "Unable to fetch details of the district."
			});
	}
};

/*..................Update a Single District Data API.....................*/
const updateDistricts = async (req, res, next) => {
	try {
		// Extract id and state_id from the request body
		const {
			id,
			state_id
		} = req.body;
		// Check if the provided state_id exists in the State model
		const isStateIDExists = await State.findOne({
			where: {
				id: state_id,
				status: {
					[Op.ne]: District.STATUS_DELETED
				}
			}
		});
		if (!isStateIDExists) {
			return res.status(404).json({
				message: "State not found."
			});
		}
		// Copy entire request body into districtData variable
		const districtData = req.body;
		// Check if the provided district ID exists in the District model
		const isDistrictIDExists = await District.findOne({
			where: {
				id: id,
				status: {
					[Op.ne]: District.STATUS_DELETED
				}
			}
		});
		if (!isDistrictIDExists) {
			return res.status(404).json({
				message: "District not found"
			});
		}
		// Update the district data using the provided information
		const isUpdated = await District.updateDistrictByID(
			districtData,
			req.user_detail,
			req.body.status
		);

		if (!isUpdated) {
			return res.status(500).json({
				message: 'Unable to update the district'
			});
		}

		// Send a success response
		return res.json({
			message: "District has been updated",
		});
	} catch (error) {
		logger.error(error);
		return res.status(500).json({
			message: "Unable to update the district."
		});
	}
};

/*..................Delete a Single District Data API.....................*/
const deleteDistrict = async (req, res, next) => {
	// Check if the provided district ID exists in the District model
	const isDistrictIDExists = await District.findOne({
		where: {
			id: req.body.id,
			status: {
				[Op.ne]: District.STATUS_DELETED
			}
		}
	});
	if (!isDistrictIDExists) {
		return res.status(404).json({
			message: "District not found"
		});
	}
	// Delete the district using the provided ID and user details
	const isDeleted = await District.deleteDistrictByID(
		req.body.id,
		req.user_detail
	);

	if (!isDeleted) {
		return res.status(500).json({
			message: 'Unable to delete the district.'
		});
	}

	// Send a success response
	return res.json({
		message: "District has been deleted",
	});
};

module.exports = {
	addDistrict,
	getAllDistricts,
	updateDistricts,
	deleteDistrict,
	detailDistrict,
};