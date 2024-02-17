const {
	Model,
	DataTypes,
	Op
} = require('sequelize');
const sequelize = require("../../util/database")
const logger = require('../../util/logger');
const moment = require('moment');

class SchemeCategory extends Model {

	static STATUS_DELETED = "0";
	static STATUS_ACTIVE = "1";
	static STATUS_INACTIVE = "2";

	async addSchemeCategory(schemeData, userDetail) {
		try {
			const currentDate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
			const newScheme = await SchemeCategory.create({
				name: schemeData.name,
				status: schemeData.status == '1' ? this.STATUS_ACTIVE : this.STATUS_INACTIVE,
				created_by: userDetail.id,
				created_at: currentDate,
				updated_by: userDetail.id,
				updated_at: currentDate,
			})
			return newScheme;
		} catch (error) {
			logger.error(error);
			return false;
		}
	}

	static async fetchAllSchemeCategories() {
		try {
			const data = await SchemeCategory.findAll({
				attributes: {
					exclude: ['created_by', 'updated_by']
				},
				where: {
					status: {
						[Op.ne]: this.STATUS_DELETED
					}
				}
			});
			return data;
		} catch (error) {
			logger.error(error);
			return [];
		}
	}

	static async fetchSchemeCaategoryDetailsByID(schemeID) {
		try {
			return await SchemeCategory.findOne({
				attributes: {
					exclude: ['created_by', 'updated_by']
				},
				where: {
					id: schemeID,
					status: {
						[Op.ne]: this.STATUS_DELETED
					}
				}
			})
		} catch (error) {
			logger.error(error);
			return null;
		}
	}

	static async editSchemeCategory(editedData, userDetail) {
		try {
			const currentDate = moment().format("YYYY-MM-DD HH:mm:ss");
			const {
				id
			} = editedData;
			const updatedData = await SchemeCategory.update({
				name: editedData.name,
				status: editedData.status,
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
			})
			return updatedData;
		} catch (error) {
			logger.error(error);
			return false;
		}
	}

	static async deleteSchemeCategory(id, userDetail) {
		const currentDate = moment().format("YYYY-MM-DD HH:mm:ss");
		try {
			return await SchemeCategory.update({
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
			})
		} catch (error) {
			logger.error(error);
			return false;
		}
	}

	static async countAllSchemeCategories() {
		return await SchemeCategory.count({
			where: {
				status: {
					[Op.ne]: this.STATUS_DELETED
				}
			}
		}).then(data => {
			return data;
		}).catch(err => {
			logger.error("Unable to count scheme categories list.");
			logger.error(err);
			return 0;
		});
	}
}

SchemeCategory.init({
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
	name: DataTypes.STRING,
}, {
	sequelize,
	modelName: 'm_scheme_categories',
	timestamps: false
});
module.exports = SchemeCategory;