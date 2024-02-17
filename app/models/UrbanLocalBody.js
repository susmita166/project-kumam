const {
	Model,
	DataTypes,
	Op
} = require('sequelize');
const sequelize = require("../../util/database");
const logger = require('../../util/logger');
const moment = require('moment');

class UrbanLocalBody extends Model {

	static STATUS_DELETED = "0";
	static STATUS_ACTIVE = "1";
	static STATUS_INACTIVE = "2";

	async createULB(ulbData, userDetail, status) {
		try {
			const currentDate = moment().format("YYYY-MM-DD HH:mm:ss");
			const newULBs = await UrbanLocalBody.create({
				name: ulbData.name,
				type_id: ulbData.type_id,
				district_id: ulbData.district_id,
				population: ulbData.population,
				area_acres: ulbData.area_acres,
				mayor: ulbData.mayor,
				deputy_mayor: ulbData.deputy_mayor,
				status: status == '1' ? this.STATUS_ACTIVE : this.STATUS_INACTIVE,
				created_by: userDetail.id,
				created_at: currentDate,
				updated_by: userDetail.id,
				updated_at: currentDate,
			})
			return newULBs;
		} catch (error) {
			logger.error(error);
			return false;
		}
	}

	static async fetchAllUrbanLocalBodies() {
		try {
			const data = await UrbanLocalBody.findAll({
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

	static async fetchUrbanLocalBodyDetailsByID(ulbID) {
		return await UrbanLocalBody.findOne({
			attributes: {
				exclude: ['created_by', 'updated_by']
			},
			where: {
				id: ulbID,
				status: {
					[Op.ne]: this.STATUS_DELETED
				}
			}
		}).then(data => {
			return data;
		}).catch(err => {
			logger.error("Unable to retrieve ULBs Details.");
			logger.error(err);
			return null;
		});
	}

	static async editULBs(updateData, userDetail) {
		const currentDate = moment().format("YYYY-MM-DD HH:mm:ss");
		return await UrbanLocalBody.update({
			name: updateData.name,
			type_id: updateData.type_id,
			district_id: updateData.district_id,
			population: updateData.population,
			area_acres: updateData.area_acres,
			mayor: updateData.mayor,
			deputy_mayor: updateData.deputy_mayor,
			status: updateData.status == '1' ? this.STATUS_ACTIVE : this.STATUS_INACTIVE,
			updated_by: userDetail.id,
			updated_at: currentDate,
		}, {
			where: {
				id: updateData.id,
				status: {
					[Op.ne]: this.STATUS_DELETED,
				},
			},
		}).then(data => {
			return true;
		}).catch(err => {
			logger.error("Unable to edit ULBs .");
			logger.error(err);
			return false;
		});
	}

	static async deleteULBs(id, userDetail) {
		const currentDate = moment().format("YYYY-MM-DD HH:mm:ss");
		return await UrbanLocalBody.update({
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
			logger.error("Unable to delete ULBs .");
			logger.error(err);
			return false;
		});
	}

	static async countAllUrbanLocalBodies() {
		return await UrbanLocalBody.count({
			where: {
				status: {
					[Op.ne]: this.STATUS_DELETED
				}
			}
		}).then(data => {
			return data;
		}).catch(err => {
			logger.error("Unable to count urban local bodies list.");
			logger.error(err);
			return 0;
		});
	}
}

UrbanLocalBody.init({
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
	type_id: {
		type: DataTypes.INTEGER,
		allowNull: false,
		defaultValue: 0
	},
	name: DataTypes.STRING,
	district_id: DataTypes.INTEGER,
	population: DataTypes.INTEGER,
	area_acres: DataTypes.DECIMAL,
	mayor: DataTypes.STRING,
	deputy_mayor: DataTypes.STRING
}, {
	sequelize,
	modelName: 'm_urban_local_bodies',
	timestamps: false
});

module.exports = UrbanLocalBody;