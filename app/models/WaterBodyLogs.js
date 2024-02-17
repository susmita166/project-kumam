const { Model, DataTypes, Op } = require('sequelize');
const moment = require('moment');
const sequelize = require("../../util/database");

class WaterBodiesLogs  extends Model {
    static STATUS_DELETED = "0";
	static STATUS_ACTIVE = "1";
	static STATUS_INACTIVE = "2";

    static async createWaterBodies(isCreated,waterBodies,userDetail){
        const currentDate = moment().format("YYYY-MM-DD HH:mm:ss");
        try {
            await WaterBodiesLogs.create({
                water_body_id: isCreated,
                district_id: waterBodies.district_id,
                scheme_id: waterBodies.scheme_id,
                ulb_id: waterBodies.ulb_id,
                name: waterBodies.name,
                latitude: waterBodies.latitude,
                longitude: waterBodies.longitude,
                category_id: waterBodies.category_id,
                area_acres: waterBodies.area_acres,
                title_holder_id: waterBodies.title_holder_id,
                ror_file_name: waterBodies.ror_file_name,
                previously_rejuvenated: waterBodies.previously_rejuvenated,
                status: waterBodies.status,
                created_by: userDetail.id,
                created_at: currentDate,
                updated_by: userDetail.id,
                updated_at: currentDate,
            });  
            return true;
        } catch (error) {
            console.error("Unable to create water body log.");
            console.error(error)
            return false;
        }
    }

    static async upadteLog(editedData,userDetail){
        const currentDate = moment().format("YYYY-MM-DD HH:mm:ss");
        try {
            await WaterBodiesLogs.create({
                water_body_id: editedData.id,
                district_id: editedData.district_id,
                scheme_id: editedData.scheme_id,
                ulb_id: editedData.ulb_id,
                name: editedData.name,
                latitude: editedData.latitude,
                longitude: editedData.longitude,
                category_id: editedData.category_id,
                area_acres: editedData.area_acres,
                title_holder_id: editedData.title_holder_id,
                ror_file_name: editedData.ror_file_name,
                previously_rejuvenated: editedData.previously_rejuvenated,
                status: editedData.status,
                created_by: userDetail.id,
                created_at: currentDate,
                updated_by: userDetail.id,
                updated_at: currentDate,
            })
            return true;
        } catch (error) {
            console.error("Unable to update water bodies log.");
            console.error(error)
            return false;
        }
    }
}

WaterBodiesLogs.init({
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
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
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
	modelName: 't_water_bodies_logs',
	timestamps: false
})

module.exports = WaterBodiesLogs ;