const { Model, DataTypes, Op } = require('sequelize');
const sequelize = require("../../util/database");
const moment = require('moment');

class WaterBodyDPRsLog extends Model {
    static STATUS_DELETED = "0";
	static STATUS_ACTIVE = "1";
	static STATUS_INACTIVE = "2";

    static async createDprsLogs(dprsCreated,dprsData,userDetail){
        const currentDate = moment().format("YYYY-MM-DD HH:mm:ss");
        try {
            await WaterBodyDPRsLog.create({
                dpr_id: dprsCreated,
                vendor_id: dprsData.vendor_id,
                preparation_date: dprsData.preparation_date,
                physical_progress_percentage: dprsData.physical_progress_percentage,
                sanctioned_amount: dprsData.sanctioned_amount,
                expected_completion_date: dprsData.expected_completion_date,
                pending_work_detail: dprsData.pending_work_detail,
                status: dprsData.status == '1' ? this.STATUS_ACTIVE : this.STATUS_INACTIVE,
                created_by: userDetail.id,
                created_at: currentDate,
                updated_by: userDetail.id,
                updated_at: currentDate,
            })
            return true; 
        } catch (error) {
            console.error("Unable to create waterbody dprslog.");
            console.error(error)
            return false;
        }
    }
}

WaterBodyDPRsLog.init({
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
    dpr_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0
    },
    vendor_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0
    },
    preparation_date: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null
    },
    physical_progress_percentage: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false,
        defaultValue: 0
    },
    sanctioned_amount: {
        type: DataTypes.DECIMAL(20,2),
        allowNull: false,
        defaultValue: 0,
        comment: 'In Lakhs'
    },
    expected_completion_date: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
    },
    pending_work_detail: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
    },
},{
	sequelize,
	modelName: 't_water_body_dprs_logs',
	timestamps: false
})

module.exports = WaterBodyDPRsLog;