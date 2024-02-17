const { Model, DataTypes, Op } = require('sequelize');
const sequelize = require("../../util/database");
const logger = require('../../util/logger');
const moment = require('moment');

class WaterBodyParameters extends Model {
    static STATUS_DELETED = "0";
	static STATUS_ACTIVE = "1";
	static STATUS_INACTIVE = "2";

    static async createWaterBodyParameters(bodydata,userDetail){
        const currentDate = moment().format("YYYY-MM-DD HH:mm:ss");
        try {
          const parameterDatas = await WaterBodyParameters.create({
            water_body_id:bodydata.water_body_id,
            bod:bodydata.bod,
            cod:bodydata.cod,
            do:bodydata.do,
            tds:bodydata.tds,
            turbidity:bodydata.turbidity,
            status:bodydata.status == '1' ? this.STATUS_ACTIVE : this.STATUS_INACTIVE,
            created_by: userDetail.id,
            created_at: currentDate,
            updated_by: userDetail.id,
            updated_at: currentDate,
          })  
          const lastInsertId = parameterDatas.get('id')
          return lastInsertId;
        } catch (error) {
            console.error("Unable to create water body parameters.");
            console.error(error)
            return false;
        }
    }

    static async updateWaterBodyParameters(parameterData, bodyData, userDetail) {
        const currentDate = moment().format("YYYY-MM-DD HH:mm:ss");
        try {
           await WaterBodyParameters.update({
            water_body_id: bodyData.water_body_id,
            bod: bodyData.bod,
            cod: bodyData.cod,
            do: bodyData.do,
            tds: bodyData.tds,
            turbidity: bodyData.turbidity,
            status: bodyData.status == '1' ? this.STATUS_ACTIVE : this.STATUS_INACTIVE,
            created_by: userDetail.id,
            created_at: currentDate,
            updated_by: userDetail.id,
            updated_at: currentDate,
           },{
            where: {
                id: parameterData.id,
                status:{ [Op.ne]: this.STATUS_DELETED }
            }
           }) 
           return true;
        } catch (error) {
            console.error("Unable to Update water bodies parameters.");
            console.error(error)
            return false;
        }
    }

    static async deleteWaterBodyParameters(id,userDetail){
        const currentDate = moment().format("YYYY-MM-DD HH:mm:ss");
        return await WaterBodyParameters.update({
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
			logger.error("Unable to delete a water bodies parameters.");
			logger.error(err);
			return false;
		});
    }
}

WaterBodyParameters.init({
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
    bod: {
        type: DataTypes.DECIMAL(12,2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Biochemical Oxygen Demand'
    },
    cod: {
        type: DataTypes.DECIMAL(12,2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Chemical Oxygen Demand'
    },
    do: {
        type: DataTypes.DECIMAL(12,2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Dissolved Oxygen'
    },
    tds: {
        type: DataTypes.DECIMAL(12,2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Total Dissolved Solids'
    },
    turbidity: {
        type: DataTypes.DECIMAL(12,2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Water Clarity'
    },
},{
	sequelize,
	modelName: 't_water_body_parameters',
	timestamps: false
})

module.exports = WaterBodyParameters 