const {
	Model,
	DataTypes,
	Op
} = require('sequelize');
const sequelize = require("../../util/database")
const logger = require('../../util/logger');
const moment = require('moment');

class Department extends Model {

	static STATUS_DELETED = "0";
	static STATUS_ACTIVE = "1";
	static STATUS_INACTIVE = "2";

	async addDepartment(name, status, userDetail) {
		const currentDate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
		return await Department.create({
			name: name,
			status: (status == '1') ? this.STATUS_ACTIVE : this.STATUS_INACTIVE,
			created_by: userDetail.id,
			created_at: currentDate,
			updated_by: userDetail.id,
			updated_at: currentDate,
		}).then(data => {
			return true;
		}).catch(err => {
			logger.error("Unable to add department.");
			logger.error(err);
			return false;
		});
	}

	static async fetchAllDepartments() {
		try {
			const data = await Department.findAll({
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

	static async fetchDepartmentDetailsByID(id) {
		return await Department.findOne({
			attributes: {
				exclude: ['created_by', 'updated_by']
			},
			where: {
				id: id,
				status: {
					[Op.ne]: this.STATUS_DELETED
				}
			}
		}).then(data => {
			return data;
		}).catch(err => {
			logger.error("Unable to retrieve department details .");
			logger.error(err);
			return null;
		});
	}

	static async editDepartment(editedData, userDetail) {
		const currentDate = moment().format("YYYY-MM-DD HH:mm:ss");
		return await Department.update({
			name: editedData.name,
			status: editedData.status == '1' ? this.STATUS_ACTIVE : this.STATUS_INACTIVE,
			updated_by: userDetail.id,
			updated_at: currentDate,
		}, {
			where: {
				id: editedData.id,
				created_by: userDetail.id,
				status: {
					[Op.ne]: this.STATUS_DELETED
				}
			},
		}).then(data => {
			return true;
		}).catch(err => {
			logger.error("Unable to edit department.");
			logger.error(err);
			return false;
		});
	}

	static async deleteDepartment(id, userDetail) {
		const currentDate = moment().format("YYYY-MM-DD HH:mm:ss");
		return await Department.update({
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
			logger.error("Unable to delete department.");
			logger.error(err);
			return false;
		});
	}

	static async countAllDepartments() {
		return await Department.count({
			where: {
				status: {
					[Op.ne]: this.STATUS_DELETED
				}
			}
		}).then(data => {
			return data;
		}).catch(err => {
			logger.error("Unable to count departments list.");
			logger.error(err);
			return 0;
		});
	}
}

Department.init({
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
	modelName: 'm_departments',
	timestamps: false
});

module.exports = Department