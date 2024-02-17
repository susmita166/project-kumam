const {
	Model,
	DataTypes,
	Op
} = require('sequelize');
const sequelize = require("../../util/database")
const logger = require('../../util/logger');
const moment = require('moment');

class ModuleRbac extends Model {

	static STATUS_DELETED = "0";
	static STATUS_ACTIVE = "1";
	static STATUS_INACTIVE = "2";

	static async addModuleRbac(roleID, moduleID, actionIDs, userDetail) {
		const currentDate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
		return await ModuleRbac.create({
			role_id: roleID,
			module_id: moduleID,
			permitted_action_ids: actionIDs ? actionIDs.join(',') : null,
			status: this.STATUS_ACTIVE,
			created_by: userDetail.id,
			created_at: currentDate,
			updated_by: userDetail.id,
			updated_at: currentDate,
		}).then(data => {
			return true;
		}).catch(err => {
			logger.error("Unable to add module rbac.");
			logger.error(err);
			return false;
		});
	}

	static async fetchAllModuleRbacsByRoleID(roleID) {
		try {
			const data = await ModuleRbac.findAll({
				attributes: {
					exclude: ['created_by', 'updated_by']
				},
				where: {
                    role_id: roleID,
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

	static async editModuleRbac(roleID, moduleID, actionIDs, userDetail) {
		const currentDate = moment().format("YYYY-MM-DD HH:mm:ss");
		return await ModuleRbac.update({
			permitted_action_ids: actionIDs ? actionIDs.join(',') : null,
			updated_by: userDetail.id,
			updated_at: currentDate,
		}, {
			where: {
				role_id: roleID,
				module_id: moduleID,
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

	static async deactivateModuleForUserRole(moduleID, roleID, userDetail) {
		const currentDate = moment().format("YYYY-MM-DD HH:mm:ss");
		return await ModuleRbac.update({
			updated_by: userDetail.id,
			updated_at: currentDate,
			status: this.STATUS_DELETED
		}, {
			where: {
				role_id: roleID,
				module_id: moduleID,
				status: {
					[Op.ne]: this.STATUS_DELETED
				}
			},
		}).then(data => {
			return true;
		}).catch(err => {
			logger.error(`Unable to deactivate module ${moduleID} for user role ${roleID}.`);
			logger.error(err);
			return false;
		});
	}
}

ModuleRbac.init({
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
	role_id: {
		type: DataTypes.BIGINT.UNSIGNED,
		allowNull: false,
		defaultValue: 0
	},
    module_id: {
		type: DataTypes.BIGINT.UNSIGNED,
		allowNull: false,
		defaultValue: 0
	},
	permitted_action_ids: {
		type: DataTypes.STRING(1024),
		allowNull: false,
	}
}, {
	sequelize,
	modelName: 'm_modules_rbac',
	timestamps: false,
	freezeTableName: true
});

module.exports = ModuleRbac