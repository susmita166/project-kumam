const {
	Model,
	DataTypes,
	Op
} = require("sequelize");
const sequelize = require("../../util/database");
const logger = require("../../util/logger");
const moment = require("moment");

class Village extends Model {

	static STATUS_DELETED = "0";
	static STATUS_ACTIVE = "1";
	static STATUS_INACTIVE = "2";

	async addVillageData(villageData, userDetail, status) {
		try {
			// Get the current date and time in the specified format
			const currentDate = moment().format("YYYY-MM-DD HH:mm:ss");
			// Create a new village record in the database
			const newVillageData = await Village.create({
				gram_panchayat_id: villageData.gram_panchayat_id,
				name: villageData.name,
				status: status == "1" ? this.STATUS_ACTIVE : this.STATUS_INACTIVE,
				remarks: villageData.remarks,
				created_by: userDetail.id,
				created_at: currentDate,
				updated_by: userDetail.id,
				updated_at: currentDate,
			});
			// Return the newly created village data
			return newVillageData;
		} catch (error) {
			// Log the error details using the logger
			logger.error("Error occur in add Village:");
			logger.error(error);
			return false;
		}
	}

	static async fetchAllVillages(gramPanchayatID) {
		// Retrieve all villages based on the provided IDs and excluding archived records
		try {
			const data = await Village.findAll({
				attributes: {
					exclude: ["created_by", "updated_by"],
				},
				where: {
					gram_panchayat_id: gramPanchayatID,
					status: {
						[Op.ne]: this.STATUS_DELETED,
					},
				},
			});
			return data;
		} catch (err) {
			logger.error("Unable to retrieve Village List .");
			logger.error(err);
			return [];
		}
	}

	static async fetchVillageDetailsByID(id, userDetail) {
		return await Village.findOne({
			attributes: {
				exclude: ["created_by", "updated_by"]
			},
			where: {
				created_by: userDetail.id,
				id: id,
				status: {
					[Op.ne]: this.STATUS_DELETED,
				},
			},
		}).then(data => {
			return data;
		}).catch(err => {
			logger.error("Unable to retrieve Village Details .");
			logger.error(err);
			return null;
		});
	}

	static async updateVillageData(updateVillage, userDetail, status) {
		// Get the current date and time in the specified format
		const currentDate = moment().format("YYYY-MM-DD HH:mm:ss");
		// Update the village data in the database
		return await Village.update({
			name: updateVillage.name,
			remarks: updateVillage.remarks,
			status: status == "1" ? this.STATUS_ACTIVE : this.STATUS_INACTIVE,
			updated_by: userDetail.id,
			updated_at: currentDate,
		}, {
			where: {
				id: updateVillage.id,
				status: {
					[Op.ne]: this.STATUS_DELETED
				}
			}
		}).then(data => {
			return true;
		}).catch(err => {
			logger.error("Unable to edit Village.");
			logger.error(err);
			return false;
		});
	}

	static async deleteVillageData(id, userDetail) {
		// Get the current date and time in the specified format
		const currentDate = moment().format("YYYY-MM-DD HH:mm:ss");
		// Delete the village from the database
		return await Village.update({
			status: this.STATUS_DELETED,
			updated_by: userDetail.id,
			updated_at: currentDate
		}, {
			where: {
				id: id,
				status: {
					[Op.ne]: this.STATUS_DELETED,
				},
			},
		}).then(data => {
			return true;
		}).catch(err => {
			logger.error("Unable to Delete Village.");
			logger.error(err);
			return false;
		});
	}

	static async countAllVillages() {
		return await Village.count({
			where: {
				status: {
					[Op.ne]: this.STATUS_DELETED
				}
			}
		}).then(data => {
			return data;
		}).catch(err => {
			logger.error("Unable to count villages list.");
			logger.error(err);
			return 0;
		});
	}
}

Village.init({
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
	gram_panchayat_id: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
	name: DataTypes.STRING,
	remarks: DataTypes.STRING,
}, {
	sequelize,
	modelName: "m_villages",
	timestamps: false,
});
module.exports = Village;