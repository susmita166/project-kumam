const titleHolder = require("../../../models/titleHolder");
const logger = require("../../../../util/logger");
const {
	Op
} = require('sequelize');

const addtitleHolder = async (req, res) => {
    try {
        const titleHolderModel = new titleHolder();
        const titleHolderData = req.body;
        const existingtitleHolder = await titleHolder.findOne({
            where: {
                name: titleHolderData.name,
                status: {
					[Op.ne]: titleHolder.STATUS_DELETED
				}
            }
        });
        
        if (existingtitleHolder) {
            return res.status(409).json({
                message: "Title Holder already exists"
            });
        }
        else{
            const isCreated = await titleHolderModel.createWaterBody(titleHolderData, req.body.status, req.user_detail);
            if (!isCreated) {
                return res.status(500).json({
                    message: 'Unable to create Title Holder'
                });
            }
            return res.json({
                message: "Title Holder has been created"
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: "Unable to create Title Holder"
        });
    }
};


const titleHolderList = async (req, res) => {
    const data = await titleHolder.fetchAlltitleHolder();
    console.log(data);
    return res.json({
        count: data.length,
        data: data
    })
}

const updatetitleHolder = async (req, res) => {
    try {
        const {
            id
        } = req.body;
        const existingtitleHolder = await titleHolder.findOne({
            where: {
                id: id,
                status: {
					[Op.ne]: titleHolder.STATUS_DELETED
				}
            }
        });
        if (!existingtitleHolder) {
            return res.status(404).json({
                message: 'Title Holder not found.'
            });
        }
        const isUpdated = await titleHolder.updatetitleHolderByID(req.body, req.user_detail);
        if (!isUpdated) {
            return res.status(500).json({
                message: 'Unable to update the Title Holder'
            });
        }
        return res.json({
            message: "Title Holder has been updated"
        });
    } catch (error) {
        return res.status(404).json({
            message: "Unable to update the Title Holder"
        })
    }
    
}

const deletetitleHolder = async (req, res) => {
    try {
        const {
            id
        } = req.body;
        const existingtitleHolder = await titleHolder.findOne({
            where: {
                id: id,
                status: {
					[Op.ne]: titleHolder.STATUS_DELETED
				}
            }
        });
        if (!existingtitleHolder) {
            return res.status(404).json({
                message: 'Title Holder not found.'
            });
        }
        const isDeleted = await titleHolder.deletetitleHolderByID(id, req.user_detail);
        if (!isDeleted) {
            return res.status(500).json({
                message: 'Unable to delete the Title Holder'
            });
        }
        return res.status(200).json({
            message: "Title Holder has been deleted"
        });
    } catch (error) {
        logger.error(error);
        return res.status(500).json({
            message: "Unable to delete the Title Holder"
        })
    }
}


const detailsBasedOntitleHoldeer = async (req, res) => {
    const data = await titleHolder.detailstitleHolderByID(req.query.id);
    if (!data) {
        return res.status(404).json({
            message: "Title Holder not found"
        });
    }
    return res.json({
        data: data
    })
}



module.exports = {
    addtitleHolder,
    titleHolderList,
    updatetitleHolder,
    deletetitleHolder,
    detailsBasedOntitleHoldeer
}