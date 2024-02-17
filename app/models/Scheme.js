const {
	Model,
	DataTypes,
	Op
} = require('sequelize');
const sequelize = require("../../util/database")
const logger = require('../../util/logger');
const moment = require('moment');

class Scheme extends Model {

	static STATUS_DELETED = "0";
	static STATUS_ACTIVE = "1";
	static STATUS_INACTIVE = "2";

	async addScheme(schemeData, status, userDetail) {
		const currentDate = moment().format("YYYY-MM-DD HH:mm:ss");
		return await Scheme.create({
			created_by: userDetail.id,
			created_at: currentDate,
			updated_by: userDetail.id,
			updated_at: currentDate,
			status: (status == '1') ? this.STATUS_ACTIVE : this.STATUS_INACTIVE,
			category_id: schemeData.category_id,
			name: schemeData.name,
			description: schemeData.description,
		}).then(data => {
			return true;
		}).catch(err => {
			logger.error("Unable to add scheme.");
			logger.error(err);
			return false;
		});
	}

	static async fetchSchemeDetailsByID(id) {
		return await Scheme.findOne({
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
			logger.error("Unable to retrieve Scheme Details .");
			logger.error(err);
			return null;
		});
	}

	static async fetchAllSchemes(categoryID) {
		try {
			return await Scheme.findAll({
				attributes: {
					exclude: ['created_by', 'updated_by']
				},
				where: {
					category_id: categoryID,
					status: {
						[Op.ne]: this.STATUS_DELETED
					}
				},
			});
		} catch (error) {
			logger.error(error);
			return [];
		}
	}

	static async editScheme(editData, userDetail) {
		const currentDate = moment().format("YYYY-MM-DD HH:mm:ss");
		const {
			id
		} = editData;
		return await Scheme.update({
			category_id: editData.category_id,
			name: editData.name,
			description: editData.description,
			status: editData.status == '1' ? this.STATUS_ACTIVE : this.STATUS_INACTIVE,
			updated_by: userDetail.id,
			updated_at: currentDate,
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
			logger.error("Unable to edit scheme.");
			logger.error(err);
			return false;
		});
	}

	static async deleteScheme(id, userDetail) {
		const currentDate = moment().format("YYYY-MM-DD HH:mm:ss");
		return await Scheme.update({
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
			logger.error("Unable to Delete scheme.");
			logger.error(err);
			return false;
		});
	}

	static async countAllSchemes() {
		return await Scheme.count({
			where: {
				status: {
					[Op.ne]: this.STATUS_DELETED
				}
			}
		}).then(data => {
			return data;
		}).catch(err => {
			logger.error("Unable to count schemes list.");
			logger.error(err);
			return 0;
		});
	}
}

Scheme.init({
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
	category_id: {
		type: DataTypes.INTEGER,
		allowNull: false,
		defaultValue: 0
	},
	name: {
		type: DataTypes.STRING(255),
		allowNull: false
	},
	description: {
		type: DataTypes.STRING(255),
		allowNull: false
	},
}, {
	sequelize,
	modelName: 'm_schemes',
	timestamps: false
});
module.exports = Scheme;