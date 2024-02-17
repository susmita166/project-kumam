const UrbanLocalBody = require('../../../models/UrbanLocalBody')
const District = require("../../../models/District")
const {
	Op
} = require('sequelize');
const UrbanLocalBodyType = require('../../../models/UrbanLocalBodyType');

const addULBs = async (req, res) => {
	const ulbModel = new UrbanLocalBody()
	const ulbData = req.body;
	const ulbTypeDetail = await UrbanLocalBodyType.fetchTypeDetailsByID(req.body.type_id); 
	if (!ulbTypeDetail) {
		return res.status(404).json({
			message: 'Urban local body type not found.'
		});
	}
	const existingDistrict = await District.findOne({
		where: {
			id: ulbData.district_id,
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
	const existingULBName = await UrbanLocalBody.findOne({
		where: {
			name: ulbData.name,
			status: {
				[Op.ne]: UrbanLocalBody.STATUS_DELETED
			}
		}
	})
	if (existingULBName) {
		return res.status(409).json({
			message: "Urban local body already exists"
		});
	}
	const isCreated = await ulbModel.createULB(ulbData, req.user_detail, req.body.status);
	if (!isCreated) {
		return res.status(500).json({
			message: 'Unable to create Urban local body'
		});
	}
	return res.json({
		message: "Urban local body has been created"
	})
}

const ULBsList = async (req, res) => {
	const data = await UrbanLocalBody.fetchAllUrbanLocalBodies();
	const ulbTypes = await UrbanLocalBodyType.fetchAllTypes(true);
	const ulbTypesMappedByID = [];
	ulbTypes.forEach(item => {
		ulbTypesMappedByID[item.id] = item;
	});
	data.forEach((ulb, index) => {
		data[index].dataValues.type_name = (ulbTypesMappedByID[ulb.type_id]) ? ulbTypesMappedByID[ulb.type_id].name : '';
	});
	return res.json({
		count: data.length,
		data: data
	});
}

const ULBsDetails = async (req, res) => {
	try {
		const data = await UrbanLocalBody.fetchUrbanLocalBodyDetailsByID(req.query.id);
		if (!data) {
			return res.status(404).json({
				message: 'Urban local body not found'
			});
		}
		const stateDetails = await District.fetchDistrictDetailsByID(req.query.id);
		data.dataValues.state_id = null;
		if (stateDetails && data) {
			data.dataValues.state_id = stateDetails.state_id;
		}
		return res.json({
			data: data
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			message: "Unable to fetch the details of the Urban local body"
		});
	}
};

const editULBs = async (req, res) => {
	const {
		id,
		district_id
	} = req.body;
	const ulbTypeDetail = await UrbanLocalBodyType.fetchTypeDetailsByID(req.body.type_id); 
	if (!ulbTypeDetail) {
		return res.status(404).json({
			message: 'Urban local body type not found.'
		});
	}
	const existingULBID = await UrbanLocalBody.findOne({
		where: {
			id: id,
			status: {
				[Op.ne]: UrbanLocalBody.STATUS_DELETED
			}
		}
	});
	if (!existingULBID) {
		return res.status(404).json({
			message: 'Urban local body not found.'
		});
	}
	const existingDistrictID = await District.findOne({
		where: {
			id: district_id,
			status: {
				[Op.ne]: District.STATUS_DELETED
			}
		}
	});
	if (!existingDistrictID) {
		return res.status(404).json({
			message: 'District not found.'
		});
	}
	const isUpdated = await UrbanLocalBody.editULBs(req.body, req.user_detail);
	if (!isUpdated) {
		return res.status(500).json({
			message: 'Unable to update the Urban local body'
		});
	}
	return res.json({
		message: "Urban local body has been updated"
	});
}

const deleteULBs = async (req, res) => {
	const {
		id
	} = req.body;
	const existingULBID = await UrbanLocalBody.findOne({
		where: {
			id: id,
			status: {
				[Op.ne]: UrbanLocalBody.STATUS_DELETED
			}
		}
	});
	if (!existingULBID) {
		return res.status(404).json({
			message: 'Urban local body not found.'
		});
	}
	const isDeleted = await UrbanLocalBody.deleteULBs(id, req.user_detail);
	if (!isDeleted) {
		return res.status(500).json({
			message: 'Unable to delete the Urban local body'
		});
	}
	return res.json({
		message: "Urban local body has been deleted"
	})
}

module.exports = {
	addULBs,
	ULBsList,
	ULBsDetails,
	editULBs,
	deleteULBs
};