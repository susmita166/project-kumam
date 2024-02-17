const Vendor = require('../../../models/Vendor')
const {Op} = require('sequelize')
const District = require("../../../models/District")

const addVendor = async (req,res) => {
    const vendorData = req.body;
    const existingDistrict = await District.findOne({
		where: {
			id: vendorData.district_id,
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
    const isExists = await Vendor.findOne({
        where:{
            name: vendorData.name,
            status: { [Op.ne]:Vendor.STATUS_DELETED}
        }
    })
    if(isExists) {
        return res.status(409).json({message:"Vendor already exists"})
    }

    const isCreated =await Vendor.createVendor(vendorData,req.user_detail)
    if(!isCreated) {
        return res.status(404).json({message: "Unable to create a Vendor."})
    }
    return res.json({message: "Vendor created successfully"})
}

const vendorlist = async (req, res) => {
    const data = await Vendor.fetchVendorList();
    return res.json({ count: data.length, data: data });
}

const fetchVendorDetails = async (req, res) => {
    const data = await Vendor.vendorDetails(req.query.id)
    if(!data){
        return res.status(404).json({message:"Vendor not found!"})
    }
    return res.json(data)
}

const editVendor = async (req, res) => {
    const updateData = req.body;
    const isExists = await Vendor.vendorDetails(updateData.id)
    if(!isExists) {
        return res.status(404).json({message:"Vendor not found!"})
    }
    const isUpdated = await Vendor.vendorUpdate(updateData,req.user_detail)
    if(!isUpdated){
        return res.status(404).json({message:"Vendor not updated!"})
    }
    return res.json({message:"Vendor has been updated."})
}

const deleteVendor = async (req, res) => {
    const isExists = await Vendor.vendorDetails(req.body.id)
    if(!isExists) {
        return res.status(404).json({message:"Vendor not found!"})
    }
    const isDeleted = await Vendor.vendorDelete(req.body.id, req.user_detail)
    if(!isDeleted){
        return res.status(500).json({message:"Unable to delete vendor."})
    }
    return res.json({message:"Vendor has been deleted"})
}

module.exports = {
    addVendor,
    vendorlist,
    fetchVendorDetails,
    editVendor,
    deleteVendor
}