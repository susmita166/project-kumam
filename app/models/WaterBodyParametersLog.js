const { Model, DataTypes, Op } = require('sequelize');
const sequelize = require("../../util/database");
const moment = require('moment');

class WaterBodyParametersLog extends Model {
    static STATUS_DELETED = "0";
	static STATUS_ACTIVE = "1";
	static STATUS_INACTIVE = "2";

    static async createParametersLogs(parametersCreated,parametersData, userDetail){
        const currentDate = moment().format("YYYY-MM-DD HH:mm:ss");
        try {
          await WaterBodyParametersLog.create({
            parameter_id: parametersCreated,
            bod: parametersData.bod,
            cod: parametersData.cod,
            do: parametersData.do,
            tds: parametersData.tds,
            turbidity: parametersData.turbidity,
            status: parametersData.status == '1' ? this.STATUS_ACTIVE : this.STATUS_INACTIVE,
            created_by: userDetail.id,
            created_at: currentDate,
            updated_by: userDetail.id,
            updated_at: currentDate,
          })
          return true;  
        } catch (error) {
            console.error("Unable to create water body parameterslog.");
            console.error(error)
            return false;
        }
    }
}

WaterBodyParametersLog.init({
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
    parameter_id: {
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
	modelName: 't_water_body_parameters_logs',
	timestamps: false
})

module.exports = WaterBodyParametersLog; 