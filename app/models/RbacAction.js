const {
	Model,
	DataTypes,
	Op
} = require('sequelize');
const sequelize = require("../../util/database")
const logger = require('../../util/logger');
const moment = require('moment');

class RbacAction extends Model {

	static STATUS_DELETED = "0";
	static STATUS_ACTIVE = "1";
	static STATUS_INACTIVE = "2";

	static ACTION_CREATE = '1';
	static ACTION_VIEW = '2';
	static ACTION_UPDATE = '3';
	static ACTION_LIST = '4';
	static ACTION_EXPORT_REPORT = '5';
	static ACTION_DELETE = '6';

	static async fetchAllRbacActions() {
		try {
			const data = await RbacAction.findAll({
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

	static async fetchMultipleRbacActionDetailsByIDs(idList = []) {
		return await RbacAction.findAll({
			attributes: {
				exclude: ['created_by', 'updated_by']
			},
			where: {
				id: {
                    [Op.in]: idList
                },
				status: {
					[Op.ne]: this.STATUS_DELETED
				}
			}
		}).then(data => {
			return data;
		}).catch(err => {
			logger.error("Unable to retrieve rbac actions details .");
			logger.error(err);
			return null;
		});
	}
}

RbacAction.init({
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
	}
}, {
	sequelize,
	modelName: 'm_rbac_actions',
	timestamps: false
});

module.exports = RbacAction