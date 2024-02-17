const Block = require("../../../models/Block")
const State = require("../../../models/State")
const District = require("../../../models/District")
const {Op} = require("sequelize");

const addBlock = async (req, res) => {
	/* create an instance of the Block model */
	const blockModel = new Block();
	/* Extract block data from the request body */
	const blockData = req.body;
	/* Check if the provided state ID exists in the State model */
	const existingState = await State.findOne({
		where: {
			id: blockData.state_id,
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
	/* Check if the provided District ID exists in the District model */
	const existingDistrict = await District.findOne({
		where: {
			id: blockData.district_id,
			status: {
				[Op.ne]: District.STATUS_DELETED
			}
		}
	});
	if (!existingDistrict) {
		return res.status(404).json({
			message: "District not found"
		});
	}
	/*  Check if a block with the same name already exists */
	const existingBlockName = await Block.findOne({
		where: {
			name: blockData.name,
			status: {
				[Op.ne]: Block.STATUS_DELETED
			}
		}
	})
	if (existingBlockName) {
		return res.status(409).json({
			message: "Block already exists"
		});
	}
	/* Create a new block using the blockModel instance */
	const isCreated = await blockModel.createBlock(blockData, req.user_detail, req.body.status);
	if (!isCreated) {
		return res.status(500).json({
			message: 'Unable to create block'
		});
	}
	/* Return success message if the block creation is successful */
	return res.json({
		message: "Block has been created"
	})
}

const blockList = async (req, res) => {

	let stateDetail = null;
	if (req.query.state_id) {
		stateDetail = await State.findOne({
			where: {
				id: req.query.state_id,
				status: {
					[Op.ne]: State.STATUS_DELETED
				}
			}
		});
		if (!stateDetail) {
			return res.status(404).json({
				message: "State not found"
			});
		}
	}
	
	let districtDetail = null;
	if (req.query.district_id) {
		districtDetail = await District.findOne({
			where: {
				id: req.query.district_id,
				status: {
					[Op.ne]: District.STATUS_DELETED
				}
			}
		});
		if (!districtDetail) {
			return res.status(404).json({
				message: "District not found"
			});
		}

		if (stateDetail && districtDetail.state_id != stateDetail.id) {
			return res.status(422).json({
				message: "The provided district ID does not correspond to the provided state ID"
			});
		}
	}

	let districtsForFilter = [];

	if (stateDetail && districtDetail) {
		districtsForFilter = [districtDetail.id];
	} else if (!stateDetail && districtDetail) {
		districtsForFilter = [districtDetail.id];
	} else if (stateDetail && !districtDetail) {
		const districtsInState = await District.fetchAllDistrictsWithSelectiveFields(stateDetail.id, ['id']);
		districtsForFilter = districtsInState.map(item => item.id);
	}

	const [blocks, allDistricts, allStates] = await Promise.all([
		Block.fetchAllBlocks(districtsForFilter),
		District.fetchAllDistrictsWithSelectiveFields(null, ['id', 'state_id', 'name']),
		State.fetchAllStates()
	]);

	const allDistrictsMappedByID = allDistricts.reduce((acc, item) => {
		acc[item.id] = item;
		return acc;
	}, {});

	const allStatesMappedByID = allStates.reduce((acc, item) => {
		acc[item.id] = item;
		return acc;
	}, {});

	const chunkSize = 1000;
	const chunks = [];
	for (let i = 0; i < blocks.length; i += chunkSize) {
		chunks.push(blocks.slice(i, i + chunkSize));
	}

	const promises = chunks.map(chunk => {
		return Promise.all(chunk.map(item => {
			const indDistrictDetail = allDistrictsMappedByID[item.district_id];
			const stateDetail = indDistrictDetail ? allStatesMappedByID[indDistrictDetail.state_id] : null;
			item.dataValues.district_name = indDistrictDetail ? indDistrictDetail.name : null;
			item.dataValues.state_id = stateDetail ? stateDetail.id : null;
			item.dataValues.state_name = stateDetail ? stateDetail.name : null;
		}));
	});

	await Promise.all(promises);

	return res.json({
		count: blocks.length,
		data: blocks
	});
};

const blockDetails = async (req, res) => {
	try {
		const {
			id
		} = req.query;
		const data = await Block.fetchBlockDetailByID(id);
		if (data) {
			const districtDetail = await District.fetchDistrictDetailsByID(id);
			data.dataValues.district_name = null;
			data.dataValues.state_id = null;
			data.dataValues.state_name = null;
			if (districtDetail) {
				data.dataValues.district_name = districtDetail.name;
				data.dataValues.state_id = districtDetail.state_id;
				const stateDetail = await State.fetchStateDetailsByID(districtDetail.state_id);
				if (stateDetail) {
					data.dataValues.state_name = stateDetail.name;
				}
			}
		}
		return res.json({
			data: data
		});
	} catch (error) {
		return res.status(500).json({
			message: "Unable to fetch detail of the block."
		});
	}
}

const editBlock = async (req, res) => {
	/* Extract block data from the request body */
	const {
		id
	} = req.body;
	/* Check if the provided Block ID exists in the Block model */
	const existingBlockID = await Block.findOne({
		where: {
			id: id,
			status: {
				[Op.ne]: Block.STATUS_DELETED
			}
		}
	});
	if (!existingBlockID) {
		return res.status(404).json({
			message: 'Block not found.'
		});
	}
	const districtDetail = await District.fetchDistrictDetailsByID(req.body.district_id);
	if (!districtDetail) {
		return res.status(404).json({
			message: 'District not found.'
		});
	}
	/* Update the Block details with the provided information and user details */
	const isUpdated = await Block.updateBlock(req.body, req.user_detail);
	if (!isUpdated) {
		return res.status(500).json({
			message: 'Unable to update the block'
		});
	}
	/* Return a JSON response with a success message */
	return res.json({
		message: "Block has been updated"
	});
}

const deleteBlock = async (req, res) => {
	/* Extract block data from the request body */
	const {
		id
	} = req.body;
	/* Check if the provided Block ID exists in the Block model */
	const existingBlockID = await Block.findOne({
		where: {
			id: id,
			status: {
				[Op.ne]: Block.STATUS_DELETED
			}
		}
	});
	if (!existingBlockID) {
		return res.status(404).json({
			message: 'Block not found.'
		});
	}
	/* Call the deleteBlockByID method to perform the block deletion */
	const isDeleted = await Block.deleteBlockByID(id, req.user_detail);
	if (!isDeleted) {
		return res.status(500).json({
			message: 'Unable to delete the block'
		});
	}
	/* Return a success message if the block deletion is successful  */
	return res.json({
		message: "Block has been deleted"
	})
}

module.exports = {
	addBlock,
	blockList,
	blockDetails,
	editBlock,
	deleteBlock
};