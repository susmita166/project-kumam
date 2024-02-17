const {
	Model,
	DataTypes,
	Op
} = require("sequelize");
const sequelize = require("../../util/database");
const logger = require("../../util/logger");
const moment = require("moment");

class District extends Model {

	static STATUS_DELETED = "0";
	static STATUS_ACTIVE = "1";
	static STATUS_INACTIVE = "2";

	async addDistrict(districtData, userDetail, status) {
		try {
			// Get the current date and time in the specified format
			const currentDate = moment().format("YYYY-MM-DD HH:mm:ss");
			// Create a new district in the database using the provided data
			const newdistrictData = await District.create({
				state_id: districtData.state_id,
				name: districtData.name,
				status: status == "1" ? this.STATUS_ACTIVE : this.STATUS_INACTIVE,
				created_by: userDetail.id,
				created_at: currentDate,
				updated_by: userDetail.id,
				updated_at: currentDate,
			});
			return newdistrictData;
		} catch (error) {
			// Log the error details using the logger
			logger.error("Error: Unable to add district");
			logger.error(error);
			return false;
		}
	}

	static async fetchAllDistricts(stateID = null) {
		let whereConditions = {
			status: {
				[Op.ne]: this.STATUS_DELETED,
			},
		}
		if (stateID) {
			whereConditions.state_id = stateID;
		}
		try {
			// Retrieve districts that are not archived for the specified state_id
			return await District.findAll({
				attributes: {
					//Exclude specified attributes from the result
					exclude: ["created_by", "updated_by"],
				},
				where: whereConditions,
			});
		} catch (error) {
			// Log the error details using the logger
			logger.error("Error occur in Fetching District List:");
			logger.error(error);
			return [];
		}
	}

	static async fetchAllDistrictsWithSelectiveFields(stateID = null, fieldsList) {
		let whereConditions = {
			status: {
				[Op.ne]: this.STATUS_DELETED,
			},
		}
		if (stateID) {
			whereConditions.state_id = stateID;
		}
		try {
			return await District.findAll({
				attributes: [...fieldsList],
				where: whereConditions,
			});
		} catch (error) {
			// Log the error details using the logger
			logger.error("Error occur in Fetching District List:");
			logger.error(error);
			return [];
		}
	}

	static async fetchDistrictDetailsByID(id) {
		return await District.findOne({
			attributes: {
				exclude: ["created_by", "updated_by"],
			},
			where: {
				id: id,
				status: {
					[Op.ne]: this.STATUS_DELETED,
				},
			},
		}).then(data => {
			return data;
		}).catch(err => {
			logger.error("Unable to retrieve district Details .");
			logger.error(err);
			return null;
		});
	}

	static async updateDistrictByID(districtData, userDetail, status) {
		// Get the current date and time in the specified format
		const currentDate = moment().format("YYYY-MM-DD HH:mm:ss");
		// Update the district data in the database
		return await District.update({
			state_id: districtData.state_id,
			name: districtData.name,
			status: status == "1" ? this.STATUS_ACTIVE : this.STATUS_INACTIVE,
			updated_by: userDetail.id,
			updated_at: currentDate,
		}, {
			where: {
				id: districtData.id, // Update district based on the provided ID
				status: {
					[Op.ne]: this.STATUS_DELETED, // Exclude districts with status set to DELETED
				},
			},
		}).then(data => {
			return true;
		}).catch(err => {
			logger.error("Unable to edit District.");
			logger.error(err);
			return false;
		});
	}

	static async deleteDistrictByID(id, userDetail) {
		// Get the current date and time in the specified format
		const currentDate = moment().format("YYYY-MM-DD HH:mm:ss");
		// Delete the district from the database
		return await District.update({
			updated_by: userDetail.id,
			updated_at: currentDate,
			status: this.STATUS_DELETED
		}, {
			where: {
				id: id, // Filter districts by the specified ID
				status: {
					[Op.ne]: this.STATUS_DELETED, // Exclude districts with status set to DELETED
				},
			},
		}).then(data => {
			return true;
		}).catch(err => {
			logger.error("Unable to delete District.");
			logger.error(err);
			return false;
		});
	}

	static async countAllDistricts() {
		return await District.count({
			where: {
				status: {
					[Op.ne]: this.STATUS_DELETED
				}
			}
		}).then(data => {
			return data;
		}).catch(err => {
			logger.error("Unable to count district list.");
			logger.error(err);
			return 0;
		});
	}
}
District.init({
	id: {
		type: DataTypes.BIGINT.UNSIGNED,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true,
	},
	created_by: {
		type: DataTypes.BIGINT.UNSIGNED,
		allowNull: false,
		defaultValue: 0,
	},
	created_at: {
		type: DataTypes.DATE,
		allowNull: false,
	},
	updated_by: {
		type: DataTypes.BIGINT.UNSIGNED,
		allowNull: false,
		defaultValue: 0,
	},
	updated_at: {
		type: DataTypes.DATE,
		allowNull: false,
	},
	status: {
		type: DataTypes.ENUM(["0", "1", "2"]),
		comment: "0 (Archived), 1 (Active), 2 (Inactive)",
		allowNull: false,
		defaultValue: "1",
	},
	state_id: DataTypes.INTEGER,
	name: DataTypes.STRING
}, {
	sequelize,
	modelName: "m_districts",
	timestamps: false,
});
module.exports = District;