const Scheme = require('../../../models/Scheme')
const Department = require("../../../models/Department")
const SchemeCategory = require("../../../models/SchemeCategory")
const StateExecutingBody = require("../../../models/StateExecutingBody");
const {
	Op
} = require('sequelize');

const addScheme = async (req, res) => {
	try {
		/* create an instance of the Scheme model */
		const SchemeModel = new Scheme()
		/* Extract Scheme data from the request body */
		const schemeData = req.body;
		/* Check if the provided Scheme Category ID exists in the Scheme Category model */
		const existingSchemeCategoryID = await SchemeCategory.fetchSchemeCaategoryDetailsByID(schemeData.category_id);
		if (!existingSchemeCategoryID) {
			return res.status(404).json({
				message: "Scheme category not found"
			});
		}
		/*  Check if a Scheme with the same name already exists */
		const existingScheme = await Scheme.findOne({
			where: {
				name: schemeData.name,
				status: {
					[Op.ne]: Scheme.STATUS_DELETED
				}
			}
		})
		if (existingScheme) {
			return res.status(409).json({
				message: "Scheme already exists"
			});
		}
		/* Create a new Scheme using the SchemeModel instance */
		const isCreated = await SchemeModel.addScheme(schemeData, req.body.status, req.user_detail);
		if (!isCreated) {
			return res.status(500).json({
				message: 'Unable to create scheme'
			});
		}
		/* Return success message if the Scheme creation is successful */
		return res.json({
			message: "Scheme has been created"
		})
	} catch (error) {
		/* Return an error message if any exception occurs during Scheme creation */
		return res.status(500).json({
			message: "Unable to create scheme"
		})
	}
}

const schemeList = async (req, res) => {
	/* Check if the provided category_id exists in the Scheme Category model */
	const existingSchemeCategory = await SchemeCategory.fetchSchemeCaategoryDetailsByID(req.query.category_id);
	if (!existingSchemeCategory) {
		return res.status(404).json({
			message: "Scheme category not found"
		});
	}
	/* Fetch Scheme data based on department_id, category_id, state_executing_id and user details */
	const data = await Scheme.fetchAllSchemes(req.query.category_id)
	/* Return the fetched Scheme List */
	return res.json({
		count: data.length,
		data: data
	})
}

const schemeDetail = async (req, res) => {
	try {
		const data = await Scheme.fetchSchemeDetailsByID(req.query.id);
		return res.json({
			data: data
		});
	} catch (error) {
		return res.status(500).json({
			message: "Unable to fetch detail of the scheme."
		});
	}
}

const editScheme = async (req, res) => {
	try {
		/* Check if the provided Scheme ID exists in the Scheme model */
		const existingSchemeID = await Scheme.fetchSchemeDetailsByID(req.body.id);
		if (!existingSchemeID) {
			return res.status(404).json({
				message: 'Scheme not found.'
			});
		}
		/* Check if the provided category_id exists in the Scheme Category model */
		const existingSchemeCategory = await SchemeCategory.fetchSchemeCaategoryDetailsByID(req.body.category_id);;
		if (!existingSchemeCategory) {
			return res.status(404).json({
				message: "Scheme category not found"
			});
		}
		/* Call the editScheme method and update the Scheme data with the provided information and user details */
		const isUpdated = await Scheme.editScheme(req.body, req.user_detail);
		if (!isUpdated) {
			return res.status(500).json({
				message: 'Unable to update scheme'
			});
		}
		/* Return a JSON response with a success message */
		return res.json({
			message: "Scheme has been updated"
		})
	} catch (error) {
		/* Return an error message if any exception occurs during Scheme editing */
		return res.status(500).json({
			message: "Unable to update scheme"
		})
	}
}

const deleteScheme = async (req, res) => {
	try {
		/* Extract the Scheme ID from the request body */
		const {
			id
		} = req.body;
		/* Check if the provided Scheme ID exists in the Scheme model */
		const existingSchemeID = await Scheme.fetchSchemeDetailsByID(req.body.id);
		if (!existingSchemeID) {
			return res.status(404).json({
				message: 'Scheme not found.'
			});
		}
		/* Call the deleteScheme method to perform the Scheme deletion */
		const isDeleted = await Scheme.deleteScheme(id, req.user_detail);
		if (!isDeleted) {
			return res.status(500).json({
				message: 'Unable to delete the scheme'
			});
		}
		/* Return a success message if the scheme deletion is successful  */
		return res.json({
			message: "Scheme has been deleted"
		})
	} catch (error) {
		/* Return an error message if any exception occurs during Scheme deletion */
		return res.status(500).json({
			message: "Unable to delete the scheme"
		})
	}
}

module.exports = {
	addScheme,
	editScheme,
	schemeDetail,
	schemeList,
	deleteScheme
}