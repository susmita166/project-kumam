const GramPanchayat = require("../../../models/Grampanchayat");
const logger = require("../../../../util/logger");
const District = require("../../../models/District");
const Block = require("../../../models/Block");
const State = require("../../../models/State");
const {
	Op
} = require("sequelize");

/*................Adding Gram panchayat Data API.................*/
const addGramPanchayat = async (req, res) => {
	try {
		// Create a new instance of GramPanchayat model
		const gramPanchayatModel = new GramPanchayat();
		// Extract state_id, block_id, and district_id from the request body
		const {
			state_id,
			block_id,
			district_id
		} = req.body;
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
		// Check if the provided district_id exists in the District model
		const isDistrictIDExists = await District.findOne({
			where: {
				id: district_id,
				status: {
					[Op.ne]: District.STATUS_DELETED
				}
			},
		});
		if (!isDistrictIDExists) {
			return res.status(404).json({
				message: "District not found"
			});
		}
		// Check if the provided block_id exists in the Block model
		const isBlockIDExists = await Block.findOne({
			where: {
				id: block_id,
				status: {
					[Op.ne]: Block.STATUS_DELETED
				}
			}
		});
		if (!isBlockIDExists) {
			return res.status(404).json({
				message: "Block not found"
			});
		}
		//Copy entire request body into gramPanchayatData variable
		const gramPanchayatData = req.body;
		// Check if a gram panchayat with the same name already exists
		const existingGramPanchayatData = await GramPanchayat.findOne({
			where: {
				name: gramPanchayatData.name,
				status: {
					[Op.ne]: GramPanchayat.STATUS_DELETED
				}
			},
		});
		if (existingGramPanchayatData) {
			return res.status(409).json({
				message: "Gram panchayat already exists"
			});
		}
		// Add gram panchayat data using the gramPanchayatModel
		const data = await gramPanchayatModel.addGrampanchayatData(
			gramPanchayatData,
			req.user_detail,
			req.body.status
		);
		// Check if data was created successfully
		if (!data) {
			return res
				.status(500)
				.json({
					message: "Unable to create gram panchayat"
				});
		}
		// Send a success response
		return res.json({
			message: "Gram panchayat has been created"
		});
	} catch (error) {
		console.log(error)
		return res
			.status(500)
			.json({
				message: "Unable to create gram panchayat."
			});
	}
};

/*List of All Gram panchayat Under a State and a Given District and Block*/
const listOfAllGramPanchayat = async (req, res) => {
	try {
		// Extract state_id, district_id, and block_id from the query parameters
		const {
			state_id,
			district_id,
			block_id
		} = req.query;
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
		// Check if the provided district_id exists in the District model
		const isDistrictIDExists = await District.findOne({
			where: {
				id: district_id,
				status: {
					[Op.ne]: District.STATUS_DELETED
				}
			},
		});
		if (!isDistrictIDExists) {
			return res.status(404).json({
				message: "District not found"
			});
		}
		// Check if the provided block_id exists in the Block model
		const isBlockIDExists = await Block.findOne({
			where: {
				id: block_id,
				status: {
					[Op.ne]: Block.STATUS_DELETED
				}
			}
		});
		if (!isBlockIDExists) {
			return res.status(404).json({
				message: "Block not found"
			});
		}
		// Retrieve the list of gram panchayats based on the provided IDs
		const data = await GramPanchayat.fetchAllGramPanchayats(block_id);
		// Send the response with the count and data
		return res.json({
			count: data.length,
			data: data
		});
	} catch (error) {
		logger.error(error);
		return res
			.status(500)
			.json({
				message: "Unable to fetch the list of gram panchayats."
			});
	}
};

const gramPanchayatDetails = async (req, res) => {
	try {
		const {
			id
		} = req.query;
		const data = await GramPanchayat.fetchGramPanchayatDetailsByID(id);
		if (data) {
			const blockDetail = await Block.fetchBlockDetailByID(data.block_id);
			data.dataValues.block_name = null;
			data.dataValues.district_id = null;
			data.dataValues.district_name = null;
			data.dataValues.state_id = null;
			data.dataValues.state_name = null;
			if (blockDetail) {
				data.dataValues.block_name = blockDetail.name;
				const districtDetail = await District.fetchDistrictDetailsByID(blockDetail.district_id);
				if (districtDetail) {
					data.dataValues.district_id = districtDetail.id;
					data.dataValues.district_name = districtDetail.name;
					data.dataValues.state_id = districtDetail.state_id;
					const stateDetail = await State.fetchStateDetailsByID(districtDetail.state_id);
					if (stateDetail) {
						data.dataValues.state_name = stateDetail.name;
					}
				}
			}
		}
		return res.json({
			data: data
		});
	} catch (error) {
		return res.status(500).json({
			message: "Unable to fetch detail of the Gram panchayat."
		});
	}
}

/*..................Update Gram Panchayt Data API.....................*/
const updateGramPanchayat = async (req, res) => {
	try {
		// Extract id, state_id, district_id, and block_id from the request body
		const {
			id,
			state_id,
			district_id,
			block_id
		} = req.body;
		//Copy entire request body into gramPanchayatData variable
		const gramPanchayatData = req.body;
		// Check if the provided gramPanchayatID exists in the Grampanchayat model
		const isgramPanchayatIDExists = await GramPanchayat.findOne({
			where: {
				id: id,
				status: {
					[Op.ne]: State.STATUS_DELETED
				}
			},
		});
		if (!isgramPanchayatIDExists) {
			return res.status(404).json({
				message: "Gram panchayat not found"
			});
		}
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
		// Check if the provided district_id exists in the District model
		const isDistrictIDExists = await District.findOne({
			where: {
				id: district_id,
				status: {
					[Op.ne]: District.STATUS_DELETED
				}
			},
		});
		if (!isDistrictIDExists) {
			return res.status(404).json({
				message: "District not found"
			});
		}
		// Check if the provided block_id exists in the Block model
		const isBlockIDExists = await Block.findOne({
			where: {
				id: block_id,
				status: {
					[Op.ne]: Block.STATUS_DELETED
				}
			}
		});
		if (!isBlockIDExists) {
			return res.status(404).json({
				message: "Block not found"
			});
		}
		// Update the gram panchayat data using the provided information
		const data = await GramPanchayat.updateGramPanchayatData(
			gramPanchayatData,
			req.user_detail,
			req.body.status
		);
		// Check if the data was updated successfully
		if (!data) {
			return res
				.status(500)
				.json({
					message: "Unable to update gram panchayat"
				});
		}
		// Send a success response
		return res.json({
			message: "Gram panchanyat has been updated"
		});
	} catch (error) {
		return res
			.status(500)
			.json({
				message: "Unable to update the gram panchayat."
			});
	}
};

/*..................Delete Gram panchayat Data API.....................*/
const deleteGramPanchayat = async (req, res, next) => {
	try {
		// Extract id from the request body
		const {
			id
		} = req.body;
		// Check if the provided Gram panchayat ID exists in the Grampanchayat model
		const isgramPanchayatIDExists = await GramPanchayat.findOne({
			where: {
				id: id,
				status: {
					[Op.ne]: GramPanchayat.STATUS_DELETED
				}
			},
		});
		if (!isgramPanchayatIDExists) {
			return res.status(404).json({
				message: "Gram panchayat not found"
			});
		}
		// Delete the Gram panchayat data using the provided ID and user details
		const isDeleted = await GramPanchayat.deleteGramPanchayat(
			id,
			req.user_detail
		);
		if (!isDeleted) {
			return res.status(500).json({
				message: 'Unable to delete the gram panchayat'
			});
		}
		// Send a success response
		return res.json({
			message: "Gram panchayat has been deleted"
		});
	} catch (error) {
		return res
			.status(500)
			.json({
				message: "Unable to delete the gram panchayat."
			});
	}
};

module.exports = {
	addGramPanchayat,
	listOfAllGramPanchayat,
	gramPanchayatDetails,
	updateGramPanchayat,
	deleteGramPanchayat,
};