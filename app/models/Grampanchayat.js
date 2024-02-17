const {
	Model,
	DataTypes,
	Op
} = require("sequelize");
const sequelize = require("../../util/database");
const moment = require("moment");
const logger = require("../../util/logger");

class Grampanchayat extends Model {

	static STATUS_DELETED = "0";
	static STATUS_ACTIVE = "1";
	static STATUS_INACTIVE = "2";

	async addGrampanchayatData(gramPanchayatData, userDetail, status) {
		// Get the current date and time in the specified format
		const currentDate = moment().format("YYYY-MM-DD HH:mm:ss");
		// Create a new gram panchayat in the database using the provided data
		return await Grampanchayat.create({
			block_id: gramPanchayatData.block_id,
			name: gramPanchayatData.name,
			gp_code: gramPanchayatData.gp_code,
			status: status == "1" ? this.STATUS_ACTIVE : this.STATUS_INACTIVE,
			created_by: userDetail.id,
			created_at: currentDate,
			updated_by: userDetail.id,
			updated_at: currentDate,
		}).then(data => {
			return true;
		}).catch(err => {
			logger.error("Unable to add Grampanchayat.");
			logger.error(err);
			return false;
		});
	}

	static async fetchAllGramPanchayats(blockID) {
		// Retrieve gram panchayats that are not archived for the specified state_id, district_id, and blockID
		return await Grampanchayat.findAll({
			attributes: {
				exclude: ["created_by", "updated_by"],
			},
			where: {
				block_id: blockID,
				status: {
					[Op.ne]: this.STATUS_DELETED, // Exclude gram panchayats with status set to DELETED
				},
			},
		}).then(data => {
			return data;
		}).catch(err => {
			logger.error("Unable to retrieve Grampanchayat List.");
			logger.error(err);
			return [];
		});
	}

	static async fetchGramPanchayatDetailsByID(id) {
		return await Grampanchayat.findOne({
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
			logger.error("Unable to retrieve Grampanchayat details.");
			logger.error(err);
			return null;
		});
	}

	static async updateGramPanchayatData(gramPanchayatData, userDetail, status) {
		// Get the current date and time in the specified format
		const currentDate = moment().format("YYYY-MM-DD HH:mm:ss");
		// Update the gram panchayat data in the database
		return await Grampanchayat.update({
			name: gramPanchayatData.name,
			gp_code: gramPanchayatData.gp_code,
			status: status == "1" ? this.STATUS_ACTIVE : this.STATUS_INACTIVE,
			updated_by: userDetail.id,
			updated_at: currentDate,
		}, {
			where: {
				id: gramPanchayatData.id,
				status: {
					[Op.ne]: this.STATUS_DELETED, // Exclude gram panchayats with status set to DELETED
				},
			},
		}).then(data => {
			return true;
		}).catch(err => {
			logger.error("Unable to edit Grampanchayat.");
			logger.error(err);
			return false;
		});
	}

	static async deleteGramPanchayat(id, userDetail) {
		// Get the current date and time in the specified format
		const currentDate = moment().format("YYYY-MM-DD HH:mm:ss");
		// Delete the Gram panchayat with the provided ID and exclude those with status set to DELETED
		return await Grampanchayat.update({
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
			logger.error("Unable to deletr Grampanchayat.");
			logger.error(err);
			return false;
		});
	}

	static async countAllGramPanchayats() {
		return await Grampanchayat.count({
			where: {
				status: {
					[Op.ne]: this.STATUS_DELETED
				}
			}
		}).then(data => {
			return data;
		}).catch(err => {
			logger.error("Unable to count gram panchayats list.");
			logger.error(err);
			return 0;
		});
	}
}

Grampanchayat.init({
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
	block_id: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
	name: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	gp_code: {
		type: DataTypes.STRING,
		allowNull: false,
	},
}, {
	sequelize,
	modelName: "m_gram_panchayats",
	timestamps: false,
});
module.exports = Grampanchayat;