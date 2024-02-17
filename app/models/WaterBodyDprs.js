const { Model, DataTypes, Op } = require('sequelize');
const sequelize = require("../../util/database");
const logger = require('../../util/logger');
const moment = require('moment');

class WaterBodyDPRs extends Model {
    static STATUS_DELETED = "0";
	static STATUS_ACTIVE = "1";
	static STATUS_INACTIVE = "2";

    static async createWaterBodyDprs(bodydata,userDetail){
        const currentDate = moment().format("YYYY-MM-DD HH:mm:ss");
        try {
            const dprsbodyData = await WaterBodyDPRs.create({
                water_body_id: bodydata.water_body_id,
                vendor_id: bodydata.vendor_id,
                preparation_date: bodydata.preparation_date,
                physical_progress_percentage: bodydata.physical_progress_percentage,
                sanctioned_amount: bodydata.sanctioned_amount,
                expected_completion_date: bodydata.expected_completion_date,
                pending_work_detail: bodydata.pending_work_detail,
                status: bodydata.status == '1' ? this.STATUS_ACTIVE : this.STATUS_INACTIVE,
                created_by: userDetail.id,
                created_at: currentDate,
                updated_by: userDetail.id,
                updated_at: currentDate,
            })
            const lastInsertId = dprsbodyData.get('id')
            return lastInsertId;
        } catch (error) {
            console.error("Unable to create water body dprs.");
            console.error(error)
            return false;
        } 
    }

    static async updateWaterBodyDprs(dprsData,bodyData,userDetail){
        const currentDate = moment().format("YYYY-MM-DD HH:mm:ss");
        try {
            const editedData = await WaterBodyDPRs.update({
                water_body_id: bodyData.water_body_id,
                vendor_id: bodyData.vendor_id,
                preparation_date: bodyData.preparation_date,
                physical_progress_percentage: bodyData.physical_progress_percentage,
                sanctioned_amount: bodyData.sanctioned_amount,
                expected_completion_date: bodyData.expected_completion_date,
                pending_work_detail: bodyData.pending_work_detail,
                status: bodyData.status == '1' ? this.STATUS_ACTIVE : this.STATUS_INACTIVE,
                created_by: userDetail.id,
                created_at: currentDate,
                updated_by: userDetail.id,
                updated_at: currentDate,
            },{
            where:{
                id: dprsData.id,
                status:{ [Op.ne]: this.STATUS_DELETED }
            }
           })
           return true;
        } catch (error) {
            console.error("Unable to Update water bodiesdprs.");
            console.error(error)
            return false; 
        }

    }

    static async deleteWaterBodyDprs(id,userDetail){
        const currentDate = moment().format("YYYY-MM-DD HH:mm:ss");
        return await WaterBodyDPRs.update({
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
			logger.error("Unable to delete a water body dprs.");
			logger.error(err);
			return false;
		});
    }
}

WaterBodyDPRs.init({
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
    water_body_id: {
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
	modelName: 't_water_body_dprs',
	timestamps: false
})

module.exports = WaterBodyDPRs;