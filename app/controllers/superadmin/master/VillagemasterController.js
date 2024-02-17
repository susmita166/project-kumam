const District = require("../../../models/District");
const State = require("../../../models/State");
const Block = require("../../../models/Block");
const Grampanchayat = require("../../../models/Grampanchayat");
const Village = require("../../../models/Village");
const logger = require("../../../../util/logger");
const {
	Op
} = require('sequelize');

/*................Add Village API.................*/
const addVillage = async (req, res) => {
	try {
		// Create an instance of the Village model
		const villageModel = new Village();
		// Extract the required IDs from the request body
		const {
			state_id,
			district_id,
			block_id,
			gram_panchayat_id
		} = req.body;
		// Check if the provided State ID exists in the State model
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
				message: "State not found."
			});
		}
		// Check if the provided District ID exists in the District model
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
				message: "District not found."
			});
		}
		// Check if the provided Block ID exists in the Block model
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
				message: "Block not found."
			});
		}
		// Check if the provided Gram panchayat ID exists in the Grampanchayat model
		const isGrampanchayatIDExists = await Grampanchayat.findOne({
			where: {
				id: gram_panchayat_id,
				status: {
					[Op.ne]: Grampanchayat.STATUS_DELETED
				}
			},
		});
		if (!isGrampanchayatIDExists) {
			return res.status(404).json({
				message: "Gram panchayat not found."
			});
		}
		// Retrieve village data from the request body
		const villageData = req.body;
		// Check if the village with the provided name already exists
		const existingVillageData = await Village.findOne({
			where: {
				name: villageData.name,
				status: {
					[Op.ne]: Village.STATUS_DELETED
				}
			},
		});
		if (existingVillageData) {
			return res.status(409).json({
				message: "Village already exists"
			});
		}
		// Add village data using the villageModel model method
		const isCreated = await villageModel.addVillageData(villageData, req.user_detail, req.body.status);
		if (!isCreated) {
			return res.status(500).json({
				message: 'Unable to create the village'
			});
		}
		// Send a success response
		return res.json({
			message: "Village has been created"
		})
	} catch (error) {
		logger.error(error);
		return res.status(500).json({
			message: "Unable to create the village."
		});
	}
};

/*................lList of Village.................*/
const listOfVillages = async (req, res) => {
	try {
		// Extract the required IDs from the query parameters
		const {
			state_id,
			district_id,
			block_id,
			gram_panchayat_id
		} = req.query;
		// Check if the provided State ID exists in the State model
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
				message: "State not found."
			});
		}
		// Check if the provided District ID exists in the District model
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
				message: "District not found."
			});
		}
		// Check if the provided Block ID exists in the Block model
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
				message: "Block not found."
			});
		}
		// Check if the provided Gram panchayat ID exists in the Grampanchayat model
		const isGrampanchayatIDExists = await Grampanchayat.findOne({
			where: {
				id: gram_panchayat_id,
				status: {
					[Op.ne]: Grampanchayat.STATUS_DELETED
				}
			},
		});
		if (!isGrampanchayatIDExists) {
			return res.status(404).json({
				message: "Gram panchayat not found."
			});
		}
		// Retrieve the list of villages using the provided IDs
		const data = await Village.fetchAllVillages(gram_panchayat_id);
		// Send the list of villages in the response
		return res.json({
			count: data.length,
			data: data
		})
	} catch (error) {
		logger.error(error);
		return res.status(500).json({
			message: "Unable to fetch the list of villages."
		});
	}
}

const villageDetails = async (req, res) => {
	try {
		const {
			id
		} = req.query;
		const data = await Village.fetchVillageDetailsByID(id, req.user_detail);
		if (!data) {
			return res.status(404).json({
				message: 'Village not found'
			});
		}
		const gramPanchayatDetails = await Grampanchayat.fetchGramPanchayatDetailsByID(data.gram_panchayat_id);
		data.dataValues.name = null;
		data.dataValues.block_id = null;
		data.dataValues.block_name = null;
		data.dataValues.district_id = null;
		data.dataValues.district_name = null;
		data.dataValues.state_id = null;
		data.dataValues.state_name = null;
		if (gramPanchayatDetails) {
			data.dataValues.name = gramPanchayatDetails.name;
			const blockDetail = await Block.fetchBlockDetailByID(gramPanchayatDetails.block_id);
			if (blockDetail) {
				data.dataValues.block_id = blockDetail.id;
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
		console.log(error);
		return res.status(500).json({
			message: "Unable to fetch detail of the village."
		});
	}
}

/*................Update Village....................*/
const updateVillage = async (req, res) => {
	try {
		// Extract the required IDs from the request body
		const {
			id,
			state_id,
			district_id,
			block_id,
			gram_panchayat_id
		} = req.body;
		// Check if the provided State ID exists in the State model
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
				message: "State not found."
			});
		}
		// Check if the provided District ID exists in the District model
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
				message: "District not found."
			});
		}
		// Check if the provided Block ID exists in the Block model
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
				message: "Block not found."
			});
		}
		// Check if the provided Gram panchayat ID exists in the Grampanchayat model
		const isGrampanchayatIDExists = await Grampanchayat.findOne({
			where: {
				id: gram_panchayat_id,
				status: {
					[Op.ne]: Grampanchayat.STATUS_DELETED
				}
			},
		});
		if (!isGrampanchayatIDExists) {
			return res.status(404).json({
				message: "Gram panchayat not found."
			});
		}
		// Check if the provided Village ID exists in the Village model
		const isVillagedIDExists = await Village.findOne({
			where: {
				id: id,
				status: {
					[Op.ne]: Village.STATUS_DELETED
				}
			}
		});
		if (!isVillagedIDExists) {
			return res.status(404).json({
				message: "Village not found."
			});
		}
		// Retrieve the updated village data from the request body
		const updateVillage = req.body;
		// Update the village data
		const isUpdated = await Village.updateVillageData(updateVillage, req.user_detail, req.body.status);
		if (!isUpdated) {
			return res.status(500).json({
				message: 'Unable to update the village'
			});
		}
		return res.json({
			message: "Village has been updated"
		});
	} catch (error) {
		logger.error(error);
		return res.status(500).json({
			message: "Unable to update the village"
		});
	}
}

/*.................Delete Village...................*/
const deleteVillage = async (req, res) => {
	try {
		// Extract the village ID from the request body
		const {
			id
		} = req.body;
		// Check if the provided Village ID exists in the Village model
		const isVillagedIDExists = await Village.findOne({
			where: {
				id: id,
				status: {
					[Op.ne]: Village.STATUS_DELETED
				}
			}
		});
		if (!isVillagedIDExists) {
			return res.status(404).json({
				message: "Village not found."
			})
		}
		// Delete the village data using the model method
		const isDeleted = await Village.deleteVillageData(id, req.user_detail);
		if (!isDeleted) {
			return res.status(500).json({
				message: 'Unable to delete the village'
			});
		}
		// Send a success response
		return res.json({
			message: "Village has been deleted"
		})
	} catch (error) {
		logger.error(error);
		return res.status(500).json({
			message: "Unable to delete the village"
		});
	}
}

module.exports = {
	addVillage,
	listOfVillages,
	villageDetails,
	updateVillage,
	deleteVillage
};