const { Model, DataTypes, Op } = require('sequelize');
const sequelize = require("../../util/database");
const logger = require('../../util/logger');
const moment = require('moment');

class WaterBodyCategories extends Model {
    static STATUS_DELETED = "0";
	static STATUS_ACTIVE = "1";
	static STATUS_INACTIVE = "2";

    allFields = ['id', 'created_by', 'created_at', 'updated_by', 'updated_at', 'status', 'name'];
    selectiveFields = ['id', 'created_at', 'updated_at', 'status', 'name'];

    static async createCategory(name, status, userDetail){
        const currentDate = moment().format("YYYY-MM-DD HH:mm:ss");
        return await WaterBodyCategories.create({
            name: name,
			status: status == '1' ? this.STATUS_ACTIVE : this.STATUS_INACTIVE,
            created_by: userDetail.id,
            created_at: currentDate,
            updated_by: userDetail.id,
            updated_at: currentDate,
        });
    }

    static async fetchAllCategory(getSelectiveFields =false){
        return await WaterBodyCategories.findAll({
            attributes: (getSelectiveFields) ? this.selectiveFields : this.allFields,
            // attributes: {exclude: ["created_by", "updated_by"]},
            where: {
                status: {
                    [Op.ne]: this.STATUS_DELETED
                }
            }
        })
    }
    
    static async fetchAllCategoryDetails(id, getSelectiveField =false){
        return await WaterBodyCategories.findOne({
			attributes: (getSelectiveField) ? this.selectiveFields : this.allFields,
			where: {
				id: id,
				status: {
					[Op.ne]: this.STATUS_DELETED
				}
			}
		}).then(data => {
			return data;
		}).catch(err => {
			logger.error("Unable to retrieve water body categories details.");
			logger.error(err);
			return null;
		});
    }

    static async updateCategory(id,name,status,userDetail){
        const currentDate = moment().format("YYYY-MM-DD HH:mm:ss");
        return await WaterBodyCategories.update({
            name: name,
            status: status == '1' ? this.STATUS_ACTIVE : this.STATUS_INACTIVE,
            updated_by: userDetail.id,
			updated_at: currentDate,
        },{
            where:{
                id:id,
                status:{[Op.ne]: this.STATUS_DELETED},
            }
        }).then(data=>{return true;})
        .catch(err=>{
            logger.error("Unable to edit water body category.");
			logger.error(err);
			return false;
        })
    }

    static async deleteCatrgory(id,userDetail){
        const currentDate = moment().format("YYYY-MM-DD HH:mm:ss");
        return await WaterBodyCategories.update({
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
			return data;
		}).catch(err => {
			logger.error("Unable to delete water body category.");
			logger.error(err);
			return false;
		});
    }

}

WaterBodyCategories.init({
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
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
    }
 },{
	sequelize,
	modelName: 'm_water_body_categories',
	timestamps: false
})

module.exports = WaterBodyCategories;