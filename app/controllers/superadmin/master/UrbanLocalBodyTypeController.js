const UrbanLocalBodyType = require('../../../models/UrbanLocalBodyType')
const District = require("../../../models/District")
const {
	Op
} = require('sequelize');
const logger = require('../../../../util/logger');

const addUrbanLocalBodyType = async (req, res) => {
	const isExists = await UrbanLocalBodyType.findOne({
		where: {
			name: req.body.name,
			status: {
				[Op.ne]: UrbanLocalBodyType.STATUS_DELETED
			}
		}
	})
	if (isExists) {
		return res.status(409).json({
			message: "Urban local body type already exists"
		});
	}
	const isCreated = await UrbanLocalBodyType.createType(req.body.name, req.body.status, req.user_detail);
	if (!isCreated) {
		return res.status(500).json({
			message: 'Unable to create Urban local body type'
		});
	}
	return res.json({
		message: "Urban local body type has been created"
	})
}

const allUrbanLocalBodyTypes = async (req, res) => {
	const data = await UrbanLocalBodyType.fetchAllTypes();
	return res.json({
		count: data.length,
		data: data
	});
}

const fetchUrbanLocalBodyTypeDetail = async (req, res) => {
	try {
		const data = await UrbanLocalBodyType.fetchTypeDetailsByID(req.query.id);
		if (!data) {
			return res.status(404).json({
				message: 'Urban local body type not found'
			});
		}
		return res.json({
			data: data
		});
	} catch (error) {
		logger.error(error);
		return res.status(500).json({
			message: "Unable to fetch the details of the Urban local body type"
		});
	}
};

const editUrbanLocalBodyType = async (req, res) => {
	const isExists = await UrbanLocalBodyType.fetchTypeDetailsByID(req.body.id);
	if (!isExists) {
		return res.status(404).json({
			message: 'Urban local body type not found.'
		});
	}
	const isUpdated = await UrbanLocalBodyType.updateType(req.body.id, req.body.name, req.body.status, req.user_detail);
	if (!isUpdated) {
		return res.status(500).json({
			message: 'Unable to update the Urban local body type'
		});
	}
	return res.json({
		message: "Urban local body type has been updated"
	});
}

const deleteUrbanLocalBodyType = async (req, res) => {
	const isExists = await UrbanLocalBodyType.fetchTypeDetailsByID(req.body.id);
	if (!isExists) {
		return res.status(404).json({
			message: 'Urban local body type not found.'
		});
	}
	const isDeleted = await UrbanLocalBodyType.deleteType(req.body.id, req.user_detail);
	if (!isDeleted) {
		return res.status(500).json({
			message: 'Unable to delete the Urban local body type'
		});
	}
	return res.json({
		message: "Urban local body type has been deleted"
	})
}

module.exports = {
	allUrbanLocalBodyTypes,
	fetchUrbanLocalBodyTypeDetail,
	addUrbanLocalBodyType,
	editUrbanLocalBodyType,
	deleteUrbanLocalBodyType
};