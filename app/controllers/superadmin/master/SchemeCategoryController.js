const SchemeCategory = require('../../../models/SchemeCategory');
const {
	Op
} = require('sequelize');

const addSchemeCategory = async (req, res) => {
	/* create an instance of the Scheme Category model */
	const schemeModel = new SchemeCategory()
	/* Extract Scheme Category data from the request body */
	const schemeData = req.body;
	/*  Check if a Scheme Category with the same name already exists */
	const existingSchemeCategory = await SchemeCategory.findOne({
		where: {
			name: schemeData.name,
			status: {
				[Op.ne]: SchemeCategory.STATUS_DELETED
			}
		}
	});
	if (existingSchemeCategory) {
		return res.status(409).json({
			message: "Scheme category already exists"
		});
	}
	/* Create a new Scheme Category using the schemeModel instance */
	const isCreated = await schemeModel.addSchemeCategory(schemeData, req.user_detail);
	if (!isCreated) {
		return res.status(500).json({
			message: 'Unable to create scheme category'
		});
	}
	/* Return success message if the Scheme Category creation is successful */
	return res.status(200).json({
		message: "Scheme category has been created"
	})
}

const schemeCategoryList = async (req, res) => {
	/* Call the schemeList method to fetch a list of scheme category */
	const data = await SchemeCategory.fetchAllSchemeCategories();
	/* Return a JSON response with the count of scheme category and the data itself */
	return res.json({
		count: data.length,
		data: data
	})
}

const schemeCategoryDetail = async (req, res) => {
	/* Call the schemeDetail method to fetch details of a specific Scheme category */
	const data = await SchemeCategory.fetchSchemeCaategoryDetailsByID(req.query.id)
	/* Return a 404 status if no Scheme category is found with the provided scheme_id */
	if (!data) {
		return res.status(404).json({
			message: "Scheme category not found"
		});
	}
	/* Return the fetched Scheme category details */
	return res.json({
		data: data
	})
}

const editSchemeCategory = async (req, res) => {
	/* Extract the scheme category ID from the request body */
	const {
		id
	} = req.body;
	/* Check if the provided scheme category ID exists in the SchemeCategory model */
	const existingScheme = await SchemeCategory.findOne({
		where: {
			id: id,
			status: {
				[Op.ne]: SchemeCategory.STATUS_DELETED
			}
		}
	})
	if (!existingScheme) {
		return res.status(404).json({
			message: 'Scheme category not found.'
		});
	}
	/* Call the editScheme method and update the scheme category details with the provided information and user details */
	const isUpdated = await SchemeCategory.editSchemeCategory(req.body, req.user_detail);
	if (!isUpdated) {
		return res.status(500).json({
			message: 'Unable to update the scheme category'
		});
	}
	/* Return a JSON response with a success message */
	return res.json({
		message: "Scheme category has been updated"
	})
}

const deleteSchemeCategory = async (req, res) => {
	/* Extract the scheme category ID from the request body */
	const {
		id
	} = req.body;
	/* Check if the provided scheme category ID exists in the SchemeCategory model */
	const existingScheme = await SchemeCategory.findOne({
		where: {
			id: id,
			status: {
				[Op.ne]: SchemeCategory.STATUS_DELETED
			}
		}
	})
	if (!existingScheme) {
		return res.status(404).json({
			message: 'Scheme category not found.'
		});
	}
	/* Call the deleteScheme method to perform the SchemeCategory deletion */
	const isDeleted = await SchemeCategory.deleteSchemeCategory(id, req.user_detail);
	if (!isDeleted) {
		return res.status(500).json({
			message: 'Unable to delete the scheme category'
		});
	}
	/* Return a success message if the scheme category deletion is successful  */
	return res.json({
		message: "Scheme category has been deleted"
	});
}

module.exports = {
	addSchemeCategory,
	schemeCategoryList,
	schemeCategoryDetail,
	editSchemeCategory,
	deleteSchemeCategory
}