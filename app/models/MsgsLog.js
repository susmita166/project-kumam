const { Model, DataTypes, Op } = require('sequelize');
const sequelize = require("../../util/database");
const moment = require('moment');

class MsgLog extends Model {   
    static STATUS_DELETED = "0";
	static STATUS_ACTIVE = "1";
	static STATUS_INACTIVE = "2";


    static async createMsg(lastInsertId, msgData,userDetail){
        const currentDate = moment().format("YYYY-MM-DD HH:mm:ss");
        try {
            await MsgLog.create({
                msg_id: lastInsertId,
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
                p_aadhaar_number: msgData.p_adhaar_number,
                p_aadhaar_file_name: msgData.p_aadhaar_file_name,
                p_mobile: msgData.p_mobile,
                p_email: msgData.p_email,
                s_name: msgData.s_name,
                s_father_name: msgData.s_father_name,
                s_aadhaar_number: msgData.s_aadhaar_number,
                s_aadhaar_file_name: msgData.s_aadhaar_file_name,
                s_mobile: msgData.s_mobile,
                s_email: msgData.s_email,
                status: msgData.status,
                created_by: userDetail.id,
                created_at: currentDate,
                updated_by: userDetail.id,
                updated_at: currentDate,
            })
            return true;
        } catch (error) {
            console.error("Unable to create Msglog.");
            console.error(error)
            return false;
        }
    }

    static async updateMsgData(editedData,userDetail){
        const currentDate = moment().format("YYYY-MM-DD HH:mm:ss");
        try {
            await MsgLog.create({
                msg_id: editedData.id,
                ulb_id: editedData.ulb_id,
                block_id: editedData.block_id,
                name: editedData.name,
                pan_number: editedData.pan_number,
                pan_file_name: editedData.pan_file_file,
                village_name: editedData.village,
                locality_name: editedData.locality_name,
                street_address: editedData.street_address,
                pincode: editedData.pincode,
                p_name: editedData.p_name,
                p_father_name: editedData.p_father_name,
                p_aadhaar_number: editedData.p_adhaar_number,
                p_aadhaar_file_name: editedData.p_aadhaar_file_name,
                p_mobile: editedData.p_mobile,
                p_email: editedData.p_email,
                s_name: editedData.s_name,
                s_father_name: editedData.s_father_name,
                s_aadhaar_number: editedData.s_aadhaar_number,
                s_aadhaar_file_name: editedData.s_aadhaar_file_name,
                s_mobile: editedData.s_mobile,
                s_email: editedData.s_email,
                status: editedData.status,
                created_by: userDetail.id,
                created_at: currentDate,
                updated_by: userDetail.id,
                updated_at: currentDate,
            })
            return true;
        } catch (error) {
            console.error("Unable to update Msglog.");
            console.error(error)
            return false;
        }
    }
}

MsgLog.init({
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
    msg_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        defaultValue: 0
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
	modelName: 't_msgs_logs',
	timestamps: false
})

module.exports = MsgLog;