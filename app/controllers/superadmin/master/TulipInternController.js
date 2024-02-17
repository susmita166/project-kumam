const TulipInterns = require('../../../models/TulipInterns')
const UrbanLocalBody = require('../../../models/UrbanLocalBody')
const Block = require('../../../models/Block')
const {Op} = require('sequelize')

const addTulipIntern = async (req,res) => {
    const tulipData = req.body;
    const existingULB = await UrbanLocalBody.findOne({
        where:{
            id: tulipData.ulb_id,
            status:{
                [Op.ne] : UrbanLocalBody.STATUS_DELETED
            }
        }
    })
    if(!existingULB){
        return res.status(404).json({message:"Urban Local Body not found!"})
    }
    const existingBlock = await Block.findOne({
        where:{
            id: tulipData.block_id,
            status:{
                [Op.ne]: Block.STATUS_DELETED
            }
        }
    })
    if(!existingBlock){
        return res.status(404).json({message:"Block not found!"})
    }

    const existingTulipIntern = await TulipInterns.findOne({
        where:{
            name: tulipData.name,
            status: {[Op.ne]: TulipInterns.STATUS_DELETED}
        }
    })

    if(existingTulipIntern){
        return res.status(409).json({message:"Tulip intern already exist."})
    }

    const isCreated = await TulipInterns.createTulipIntern(tulipData,req.user_detail)
    if(!isCreated){
        return res.status(404).json({message:" Unable to create a Tulip Intern!"})
    }
    return res.json({message:"Tulip Intern successfully created!"})
}

const tulipInternList = async (req, res) => {
    const data = await TulipInterns.fetchTulipList()
    return res.json({count: data.length, data: data})
}

const tulipInternDetails = async (req, res) => {
    const data = await TulipInterns.tulipInternDetail(req.query.id)
    if(!data){
        return res.status(404).json({message:"Tulip intern detail not found"})
    }
    return res.json(data)
}

const editTulipIntern = async (req, res) => {
    const editedData = req.body;
    const isExists = await TulipInterns.tulipInternDetail(editedData.id)
    if(!isExists) {
        return res.status(404).json({message:"Tulip intern Id not found"})
    }
    const isUpdated = await TulipInterns.tulipUpdate(editedData,req.user_detail)
    if(!isUpdated) {
        return res.status(404).json({message:"Tulip not updated"})
    }
    return res.json({message:"Tulip updated"})
}

const deleteTulipIntern = async (req,res) => {
    const isExists = await TulipInterns.tulipInternDetail(req.body.id)
    if(!isExists) {
        return res.status(404).json({message:"Tulip intern Id not found"})
    }
    const isDeleted = await TulipInterns.deleteTulipIntern(req.body.id, req.user_detail)
    if(!isDeleted) {
        return res.status(404).json({message: "Tulip intern not deleted"})
    }
    return res.json({message: "Tulip intern deleted successfully"})
}

module.exports = {addTulipIntern, tulipInternList, tulipInternDetails, editTulipIntern, deleteTulipIntern}