const { Model, DataTypes, Op } = require('sequelize');
const sequelize = require("../../util/database");
const logger = require('../../util/logger');
const moment = require('moment');

class Msgs extends Model {
    static STATUS_DELETED = "0";
	static STATUS_ACTIVE = "1";
	static STATUS_INACTIVE = "2";

    static async createMsg(msgData,userDetail){
        const currentDate = moment().format("YYYY-MM-DD HH:mm:ss");
        try {
            const msgbodyData = await Msgs.create({
                ulb_id: msgData.ulb_id,
                block_id: msgData.block_id,
                name: msgData.name,
                pan_number: msgData.pan_number,
                pan_file_name: msgData.pan_file_file,
                village_name: msgData.village,
                locality_name: msgData.locality_name,
                street_address: msgData.street_address,
                pincode: msgData.pincode,
                p_name: msgData.p_name,
                p_father_name: msgData.p_father_name,
                p_aadhaar_number: msgData.p_aadhaar_number,
                p_aadhaar_file_name: msgData.p_aadhaar_file_name,
                p_mobile: msgData.p_mobile,
                p_email: msgData.p_email,
                s_name: msgData.s_name,
                s_father_name: msgData.s_father_name,
                s_aadhaar_number: msgData.s_aadhaar_number,
                s_aadhaar_file_name: msgData.s_aadhaar_file_name,
                s_mobile: msgData.s_mobile,
                s_email: msgData.s_email,
                status: msgData.status == '1' ? this.STATUS_ACTIVE : this.STATUS_INACTIVE,
                created_by: userDetail.id,
                created_at: currentDate,
                updated_by: userDetail.id,
                updated_at: currentDate,
            });
            const lastInsertId = msgbodyData.get('id');
            return lastInsertId;
        } catch (error) {
            console.error("Unable to create Msg.");
            console.error(error)
            return false;
        }
    }

    static async fetchMsgList(){
        return await Msgs.findAll({
            attributes:{ exclude:["created_by", "updated_by"]},
            where:{
                status:{
                    [Op.ne]: this.STATUS_DELETED
                }
            }
        })
    }

    static async fetchMsgDetails(id){
        return await Msgs.findOne({
            attributes: {exclude:["created_by", "updated_by"]},
            where:{
                id:id,
                status:{
                    [Op.ne]:this.STATUS_DELETED
                }
            }
        }).then(data => {
            return data;
        }).catch(err => {
            logger.error("Unable to retrieve Msg details.");
			logger.error(err);
			return null;
        })
    }

    static async updateMsgDetails(updatedData, userDetail){
        const currentDate = moment().format("YYYY-MM-DD HH:mm:ss");
        const {id} = updatedData;
        try {
           const updateData = await Msgs.update({
            ulb_id: updatedData.ulb_id,
            block_id: updatedData.block_id,
            name: updatedData.name,
            pan_number: updatedData.pan_number,
            pan_file_name: updatedData.pan_file_file,
            village_name: updatedData.village,
            locality_name: updatedData.locality_name,
            street_address: updatedData.street_address,
            pincode: updatedData.pincode,
            p_name: updatedData.p_name,
            p_father_name: updatedData.p_father_name,
            p_aadhaar_number: updatedData.p_adhaar_number,
            p_aadhaar_file_name: updatedData.p_aadhaar_file_name,
            p_mobile: updatedData.p_mobile,
            p_email: updatedData.p_email,
            s_name: updatedData.s_name,
            s_father_name: updatedData.s_father_name,
            s_aadhaar_number: updatedData.s_aadhaar_number,
            s_aadhaar_file_name: updatedData.s_aadhaar_file_name,
            s_mobile: updatedData.s_mobile,
            s_email: updatedData.s_email,
            status: updatedData.status == '1' ? this.STATUS_ACTIVE : this.STATUS_INACTIVE,
            created_by: userDetail.id,
            created_at: currentDate,
            updated_by: userDetail.id,
            updated_at: currentDate,
           },{
            where:{
                id: id,
                status:{ [Op.ne]: this.STATUS_DELETED }
            }
           }) 
           return true;
        } catch (error) {
            console.error("Unable to Update Msg.");
            console.error(error)
            return false;
        }
    }

    static async deleteMsgs(id,userDetail){
        const currentDate = moment().format("YYYY-MM-DD HH:mm:ss");
        return await Msgs.update({
			status: this.STATUS_DELETED,
			updated_by: userDetail.id,
			updated_at: currentDate
		}, {
			where: {
				id: id,
				created_by: userDetail.id,
				status: {
					[Op.ne]: this.STATUS_DELETED
				}
			}
		}).then(data => {
			return true;
		}).catch(err => {
			logger.error("Unable to delete a msg.");
			logger.error(err);
			return false;
		});
    }
}

Msgs.init({
    id: {
		type: DataTypes.BIGINT.UNSIGNED,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true,
	},
	created_by: {
		type: DataTypes.BIGINT.UNSIGNED,
		allowNull: false,
		defaultValue: 0
	},
	created_at: {
		type: DataTypes.DATE,
		allowNull: false,
	},
	updated_by: {
		type: DataTypes.BIGINT.UNSIGNED,
		allowNull: false,
		defaultValue: 0
	},
	updated_at: {
		type: DataTypes.DATE,
		allowNull: false,
	},
	status: {
		type: DataTypes.ENUM(['0', '1', '2']),
		comment: "0 (Archived), 1 (Active), 2 (Inactive)",
		allowNull: false,
		defaultValue: "1"
	},
    ulb_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        defaultValue: 0
    },
    block_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        defaultValue: 0
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    p_name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    p_father_name: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    p_aadhaar_number: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    p_aadhaar_file_name: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null
    },
    p_mobile: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null
    },
    p_email: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null
    },
    s_name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    s_father_name: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    s_aadhaar_number: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    s_aadhaar_file_name: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null
    },
    s_mobile: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null
    },
    s_email: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null
    }
},{
	sequelize,
	modelName: 't_msgs',
	timestamps: false
})

module.exports = Msgs;