const { Model, DataTypes, Op } = require('sequelize');
const sequelize = require("../../util/database");
const logger = require('../../util/logger');
const moment = require('moment');

class TulipInterns extends Model {
    static STATUS_DELETED = "0";
	static STATUS_ACTIVE = "1";
	static STATUS_INACTIVE = "2";

    static async createTulipIntern(tulipData,userDetail){
        const currentDate = moment().format("YYYY-MM-DD HH:mm:ss");
        return await TulipInterns.create({
            ulb_id: tulipData.ulb_id,
            name: tulipData.name,
            father_name: tulipData.father_name,
            aadhaar_number: tulipData.aadhaar_number,
            aadhaar_file_name: tulipData.aadhaar_file_name,
            block_id: tulipData.block_id,
            village_name: tulipData.village_name,
            locality_name: tulipData.locality_name,
            street_address: tulipData.street_address,
            pincode: tulipData.pincode,
            mobile: tulipData.mobile,
            reporting_date: tulipData.reporting_date,
            email: tulipData.email,
            tenure_completion_date: tulipData.tenure_completion_date,
            offer_letter_file_name : tulipData.offer_letter_file_name,
            status: tulipData.status == '1' ? this.STATUS_ACTIVE : this.STATUS_INACTIVE,
            created_by: userDetail.id,
			created_at: currentDate,
			updated_by: userDetail.id,
			updated_at: currentDate,
        }).then(data => {
			return true;
		}).catch(err => {
			logger.error("Unable to create tulip intern.");
			logger.error(err);
			return false;
		});
    }
    
    static async fetchTulipList(){
        return await TulipInterns.findAll({
            attributes:{exclude: ["created_by", "updated_by","created_at","updated_at"]},
            where:{
                status: {
                    [Op.ne]: this.STATUS_DELETED
                }
            }
        })
    }

    static async tulipInternDetail(id){
        return await TulipInterns.findOne({
            attributes:{exclude: ["created_by", "updated_by","created_at","updated_at"]},
            where:{
                id:id,
                status: {[Op.ne]: this.STATUS_DELETED}
            }
        }).then(data => {
			return data;
		}).catch(err => {
			logger.error("Unable to retrieve Tulip intern details.");
			logger.error(err);
			return null;
		});
    }

    static async tulipUpdate(updatedData, userDetail){
        const currentDate = moment().format("YYYY-MM-DD HH:mm:ss");
		const {id} = updatedData;
        return await TulipInterns.update({
            ulb_id: updatedData.ulb_id,
            name: updatedData.name,
            father_name: updatedData.father_name,
            aadhaar_number: updatedData.aadhaar_number,
            aadhaar_file_name: updatedData.aadhaar_file_name,
            block_id: updatedData.block_id,
            village_name: updatedData.village_name,
            locality_name: updatedData.locality_name,
            street_address: updatedData.street_address,
            pincode: updatedData.pincode,
            mobile: updatedData.mobile,
            reporting_date: updatedData.reporting_date,
            email: updatedData.email,
            tenure_completion_date: updatedData.tenure_completion_date,
            offer_letter_file_name : updatedData.offer_letter_file_name,
            status: updatedData.status == '1' ? this.STATUS_ACTIVE : this.STATUS_INACTIVE,
            created_by: userDetail.id,
			created_at: currentDate,
			updated_by: userDetail.id,
			updated_at: currentDate,
        },{
            where:{
                id:id,
                status: {[Op.ne]: this.STATUS_DELETED}
            }
        }).then(data => {
			return true;
		}).catch(err => {
			logger.error("Unable to edit tulip intern.");
			logger.error(err);
			return false;
		});
    }

    static async deleteTulipIntern(id,userDetail){
        const currentDate = moment().format("YYYY-MM-DD HH:mm:ss");
        return await TulipInterns.update({
            status: this.STATUS_DELETED,
			updated_by: userDetail.id,
			updated_at: currentDate
        },{
            where: {
				id: id,
				created_by: userDetail.id,
				status: {
					[Op.ne]: this.STATUS_DELETED
				}
			}
        }).then(data => {
            return data;
        }).catch(err => {
            logger.error("Unable to delete a tulip intern.");
			logger.error(err);
			return false;
        })
    }
}

TulipInterns.init({
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
    name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    father_name: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    aadhaar_number: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    aadhaar_file_name: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null
    },
    block_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    village_name: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null
    },
    locality_name: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null
    },
    street_address: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null
    },
    pincode: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null
    },
    mobile: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null
    },
    reporting_date: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null
    },
    tenure_completion_date: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null
    },
    offer_letter_file_name: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null
    }
},{
	sequelize,
	modelName: 't_tulip_interns',
	timestamps: false
})

module.exports = TulipInterns;