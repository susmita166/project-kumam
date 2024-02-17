const Msgs =  require('../../../models/Msgs')
const MsgsLog =  require('../../../models/MsgsLog')
const UrbanLocalBody = require('../../../models/UrbanLocalBody')
const Block = require('../../../models/Block')
const {Op} = require('sequelize')

const addMsgs = async (req,res) => {
    const msgData = req.body;
    const existingULB = await UrbanLocalBody.findOne({
        where:{
            id: msgData.ulb_id,
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
            id: msgData.block_id,
            status:{
                [Op.ne]: Block.STATUS_DELETED
            }
        }
    })
    if(!existingBlock){
        return res.status(404).json({message:"Block not found!"})
    }
    const lastInsertId = await Msgs.createMsg(msgData,req.user_detail)
    if(lastInsertId && lastInsertId !== null){
        const lastInsertIdMsgLog = await MsgsLog.createMsg(lastInsertId,msgData,req.user_detail)
        if(lastInsertIdMsgLog){
            return res.json({message:"Msg created Successfully."})
        }
    } return res.status(404).json({message:"Unable to create Msg!"})
}

const msgsList = async (req,res) => {
    const data = await Msgs.fetchMsgList()
    return res.json({count:data.length, data:data})
}

const msgsDetails = async (req,res) => {
    const data = await Msgs.fetchMsgDetails(req.query.id)
    if(!data){
        return res.status(404).json({message:"Msg detail not found."})
    }
    return res.json(data)
}

const editMsgs = async (req,res) => {
    const editedData = req.body;
    const isExists = await Msgs.fetchMsgDetails(editedData.id)
    if(!isExists){
        return res.status(404).json({message:"Msg detail not found."})
    }
    const updateData = await Msgs.updateMsgDetails(editedData,req.user_detail)
    if(updateData && updateData !== false){
        const updetedDataintoLog = await MsgsLog.updateMsgData(editedData,req.user_detail)
        if(updetedDataintoLog){
            return res.status(200).json({message:"Log updated Successfully."})
        }
        return res.json({message:"Unable to update the data."})
    } 
}

const deleteMsgs = async (req,res) => {
    const isExists = await Msgs.fetchMsgDetails(req.body.id)
    if(!isExists){
        return res.status(404).json({message:"Msg detail not found."})
    }
    const isDeleted = await Msgs.deleteMsgs(req.body.id,req.user_detail)
    if(!isDeleted){
        return res.status(404).json({message: "Msg not deleted"})
    }
    return res.json({message: "Msg deleted successfully"})
}

module.exports = { addMsgs, msgsList, msgsDetails, editMsgs, deleteMsgs}
