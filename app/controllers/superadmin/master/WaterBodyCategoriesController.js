const WaterBodyCategories = require('../../../models/WaterBodyCategories')
const {Op} = require('sequelize')
const logger = require('../../../../util/logger')

const addWaterBodyCategory = async (req,res) => {
    const isExists = await WaterBodyCategories.findOne({
        where:{
            name: req.body.name,
            status: {
                [Op.ne]: WaterBodyCategories.STATUS_DELETED
            }
        }
    })
    if(isExists) {
        return res.status(409).json({message:"Water body category already exists"})
    }
    const isCreated = await WaterBodyCategories.createCategory(req.body.name, req.body.status, req.user_detail)
    if (!isCreated) {
		return res.status(500).json({message: 'Unable to create Water body category'});
	}
	return res.json({message: "Water body category has been created"})
}

const allWaterBodyCategories = async (req,res) => {
    const data = await WaterBodyCategories.fetchAllCategory();
    return res.json({count: data.length, data:data})
}

const fetchWaterBodyCategoriesDetails = async (req,res) => {
    try {
       const data = await WaterBodyCategories.fetchAllCategoryDetails(req.query.id); 
       if(!data){
        return res.status(404).json({message:"Water Body Category not found"})
       }
       return res.json({data:data})
    } catch (error) {
        logger.error(error);
		return res.status(500).json({
			message: "Unable to fetch water body category details."
		});
    }
}

const editWaterBodyCategories = async (req,res) => {
    const isExists = await WaterBodyCategories.fetchAllCategoryDetails(req.body.id)
    if(!isExists){
        return res.status(404).json({message:"Water body category not found."})
    }
    const isUpdated = await WaterBodyCategories.updateCategory(req.body.id, req.body.name, req.body.status, req.user_detail)
    if(!isUpdated){
        return res.status(404).json({message:"Water body category not updated"})
    }
    return res.json({message:"Water body category has been updated"})
}

const deleteWaterBodyCategories = async (req,res) => {
    const isExists = await WaterBodyCategories.fetchAllCategoryDetails(req.body.id)
    if(!isExists){
        return res.status(404).json({message:"Water body category ID not found."})
    }
    const isDeleted = await WaterBodyCategories.deleteCatrgory(req.body.id,req.user_detail)
    if(!isDeleted){
        return res.status(500).json({message:"Unable to delete water body category."})
    }
    return res.json({message:"Water body category has been deleted"})
}

module.exports = {
    addWaterBodyCategory,
    allWaterBodyCategories,
    fetchWaterBodyCategoriesDetails,
    editWaterBodyCategories,
    deleteWaterBodyCategories
}