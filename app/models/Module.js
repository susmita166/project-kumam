const {
	Model,
	DataTypes,
	Op
} = require('sequelize');
const sequelize = require("../../util/database")
const logger = require('../../util/logger');
const moment = require('moment');

class Module extends Model {

	static STATUS_DELETED = "0";
	static STATUS_ACTIVE = "1";
	static STATUS_INACTIVE = "2";

	static MODULE_VENDOR               = '1';
	static MODULE_MSG                  = '2';
	static MODULE_TULIP_INTERN         = '3';
	static MODULE_PROJECT              = '4';
	static MODULE_DPR                  = '5';
	static MODULE_DPR_PROGRESS         = '6';
	static MODULE_WORK_ORDER           = '7';
	static MODULE_PHYSICAL_PROGRESS    = '8';
	static MODULE_PAYMENT              = '9';
	static MODULE_INSPECTION           = '10';
	static MODULE_CAPACITY_BUILDING    = '11';

	static async addModule(name, description, actionIDs, status, userDetail) {
		const currentDate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
		return await Module.create({
			name: name,
			description: description,
			action_ids: actionIDs ? actionIDs.join(',') : null,
			status: (status == '1') ? this.STATUS_ACTIVE : this.STATUS_INACTIVE,
			created_by: userDetail.id,
			created_at: currentDate,
			updated_by: userDetail.id,
			updated_at: currentDate,
		}).then(data => {
			return true;
		}).catch(err => {
			logger.error("Unable to add module.");
			logger.error(err);
			return false;
		});
	}

	static async fetchAllModules() {
		try {
			const data = await Module.findAll({
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
	
	static async fetchMultipleModuleDetailsByIDs(moduleIDList) {
		try {
			const data = await Module.findAll({
				attributes: {
					exclude: ['created_by', 'updated_by']
				},
				where: {
					id: {
						[Op.in]: moduleIDList
					},
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

	static async fetchModuleDetailsByID(id) {
		return await Module.findOne({
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
			logger.error("Unable to retrieve module details .");
			logger.error(err);
			return null;
		});
	}
	
	static async fetchModuleDetailsByName(name) {
		return await Module.findOne({
			attributes: {
				exclude: ['created_by', 'updated_by']
			},
			where: {
				name: name,
				status: {
					[Op.ne]: this.STATUS_DELETED
				}
			}
		}).then(data => {
			return data;
		}).catch(err => {
			logger.error("Unable to retrieve module details .");
			logger.error(err);
			return null;
		});
	}

	static async editModule(id, name, description, actionIDs, status, userDetail) {
		const currentDate = moment().format("YYYY-MM-DD HH:mm:ss");
		return await Module.update({
			name: name,
			description: description,
			action_ids: actionIDs ? actionIDs.join(',') : null,
			status: status == '1' ? this.STATUS_ACTIVE : this.STATUS_INACTIVE,
			updated_by: userDetail.id,
			updated_at: currentDate,
		}, {
			where: {
				id: id,
				created_by: userDetail.id,
				status: {
					[Op.ne]: this.STATUS_DELETED
				}
			},
		}).then(data => {
			return true;
		}).catch(err => {
			logger.error("Unable to edit module.");
			logger.error(err);
			return false;
		});
	}

	static async countAllModules() {
		return await Module.count({
			where: {
				status: {
					[Op.ne]: this.STATUS_DELETED
				}
			}
		}).then(data => {
			return data;
		}).catch(err => {
			logger.error("Unable to count modules list.");
			logger.error(err);
			return 0;
		});
	}
}

Module.init({
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
	name: {
		type: DataTypes.STRING(255),
		allowNull: false,
	},
	description: {
		type: DataTypes.STRING(2048),
		allowNull: true
	},
	action_ids: {
		type: DataTypes.STRING(1024),
		allowNull: false,
	}
}, {
	sequelize,
	modelName: 'm_modules',
	timestamps: false
});

module.exports = Module