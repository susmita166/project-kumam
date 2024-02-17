const { Model, DataTypes, Op } = require('sequelize');
const sequelize = require("../../util/database");
const logger = require('../../util/logger');
const moment = require('moment');

class WaterBodies extends Model {
    static STATUS_DELETED = "0";
	static STATUS_ACTIVE = "1";
	static STATUS_INACTIVE = "2";

    static async createWaterBodies(bodydata, userDetail) {
        const currentDate = moment().format("YYYY-MM-DD HH:mm:ss");
        try {
            const waterBody = await WaterBodies.create({
                district_id: bodydata.district_id,
                scheme_id: bodydata.scheme_id,
                ulb_id: bodydata.ulb_id,
                name: bodydata.name,
                latitude: bodydata.latitude,
                longitude: bodydata.longitude,
                category_id: bodydata.category_id,
                area_acres: bodydata.area_acres,
                title_holder_id: bodydata.title_holder_id,
                ror_file_name: bodydata.ror_file_name,
                previously_rejuvenated: bodydata.previously_rejuvenated,
                status: bodydata.status == '1' ? this.STATUS_ACTIVE : this.STATUS_INACTIVE,
                created_by: userDetail.id,
                created_at: currentDate,
                updated_by: userDetail.id,
                updated_at: currentDate,
            });
            const lastInsertId = waterBody.get('id')
            return lastInsertId;
        } catch (error) {
            console.error("Unable to create water body.");
            console.error(error)
            return false;
        }
    }

    static async fetchWaterBodies(){ 
        return await WaterBodies.findAll({
            attributes: {exclude: []},
            where: {
                status: {
                    [Op.ne]: this.STATUS_DELETED
                }
            }
        })
    }

    static async WaterBodyDetail(id){
        return await WaterBodies.findOne({
            attributes: {exclude: []},
            where: {
                id: id,
                status: {
                    [Op.ne]: this.STATUS_DELETED
                }
            }
        }).then(data => {
            return data;
        }).catch(err => {
            logger.error("Unable to find WaterBody Detail.")
            logger.error(err);
            return null;
        });
    }

    static async updateWaterBody(updatedData,userDetail){
        const currentDate = moment().format("YYYY-MM-DD HH:mm:ss");
        const {id} = updatedData;
        try {
          const editedData = await WaterBodies.update({
                district_id: updatedData.district_id,
                scheme_id: updatedData.scheme_id,
                ulb_id: updatedData.ulb_id,
                name: updatedData.name,
                latitude: updatedData.latitude,
                longitude: updatedData.longitude,
                category_id: updatedData.category_id,
                area_acres: updatedData.area_acres,
                title_holder_id: updatedData.title_holder_id,
                ror_file_name: updatedData.ror_file_name,
                previously_rejuvenated: updatedData.previously_rejuvenated,
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
            console.error("Unable to Update water bodies.");
            console.error(error)
            return false;
        }
    }

    static async deleteWaterBody(id,userDetail){
        const currentDate = moment().format("YYYY-MM-DD HH:mm:ss");
        return await WaterBodies.update({
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
			logger.error("Unable to delete a water body.");
			logger.error(err);
			return false;
		});
    }

}

WaterBodies.init({
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
    scheme_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    district_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0
    },
    ulb_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    latitude: {
        type: DataTypes.DECIMAL(20,8),
        allowNull: false,
        defaultValue: 0
    },
    longitude: {
        type: DataTypes.DECIMAL(20,8),
        allowNull: false,
        defaultValue: 0
    },
    category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    area_acres: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false,
        defaultValue: 0
    },
    title_holder_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    ror_file_name: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null
    },
    previously_rejuvenated: {
        type: DataTypes.ENUM(['n', 'y']),
        comment: "n (No), y (Yes)",
        allowNull: false,
        defaultValue: "n"
    }
},{
	sequelize,
	modelName: 't_water_bodies',
	timestamps: false
})

module.exports = WaterBodies;