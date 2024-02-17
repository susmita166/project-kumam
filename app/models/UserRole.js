const {
	Model,
	DataTypes,
	Op
} = require("sequelize");
const sequelize = require("../../util/database");
const logger = require("../../util/logger");
const moment = require("moment");

class UserRole extends Model {

	STATUS_DELETED = "0";
	STATUS_ACTIVE = "1";
	STATUS_INACTIVE = "2";

	static ROLE_SUPER_ADMIN                                  = "1";

	static ROLE_HUD_PRINCIPAL_SECRETARY                      = "2";
	static ROLE_HUD_DEPARTMENT                               = "3";
	static ROLE_HUD_SPECIAL_SECRETARY_CUM_MISSION_DIRECTOR   = "4";
	static ROLE_HUD_AMRUT                                    = "5";
	static ROLE_HUD_CE_CUM_ADDITIONAL_SECRETARY              = "6";
	static ROLE_HUD_FA_CUM_ADDITIONAL_SECRETARY              = "7";
	static ROLE_HUD_DEPUTY_SECRETARY                         = "8";

	static ROLE_WRU_ADVISOR                                  = "9";
	static ROLE_WRU_DEPARTMENT                               = "10";
	
	static ROLE_SUDA_PROJECT_DIRECTOR                        = "11";
	static ROLE_SUDA_DEPARTMENT                              = "12";
	
	static ROLE_ULB_MUNICIPAL_COMMISSIONER                   = "13";
	static ROLE_ULB_ADDITIONAL_COMMISSIONER                  = "14";
	static ROLE_ULB_EXECUTIVE_OFFICER                        = "15";
	static ROLE_ULB_CITY_ENGINEER                            = "16";
	static ROLE_ULB_MUNICIPAL_ENGINEER                       = "17";
	static ROLE_ULB_JUNIOR_ENGINEER                          = "18";
	static ROLE_ULB_ACCOUNTANT                               = "19";

	allFields = ["id", "created_by", "created_at", "updated_by", "updated_at", "status", "role_name", "department_id", ];
	selectiveFields = ["id", "created_at", "updated_at", "status", "role_name", "department_id", ];

	async createRole(roleName, department_id, userDetail) {
		const currentDate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
		return await UserRole.create({
				created_by: userDetail.id,
				created_at: currentDate,
				updated_by: userDetail.id,
				updated_at: currentDate,
				status: this.STATUS_ACTIVE,
				role_name: roleName,
				department_id: department_id,
			})
			.then((data) => {
				return true;
			})
			.catch((err) => {
				logger.error("Unable to create user role");
				logger.error(err);
				return false;
			});
	}

	async fetchAllRoles(userDetail, getSelectiveFields = false, departmentID = null) {
		let whereConditions = {
			created_by: userDetail.id,
			status: {
				[Op.ne]: this.STATUS_DELETED,
			},
		};
		if (departmentID) {
			whereConditions.department_id = departmentID;
		}
		return await UserRole.findAll({
			attributes: getSelectiveFields ? this.selectiveFields : this.allFields,
			where: whereConditions
		});
	}

	async fetchRoleDetailByID(roleID, getSelectiveFields = false) {
		return await UserRole.findOne({
			attributes: getSelectiveFields ? this.selectiveFields : this.allFields,
			where: {
				id: roleID,
				status: {
					[Op.ne]: this.STATUS_DELETED,
				},
			},
		});
	}

	async fetchRoleDetailByName(roleName, userDetail) {
		return await UserRole.findOne({
			where: {
				created_by: userDetail.id,
				role_name: roleName,
				status: {
					[Op.ne]: this.STATUS_DELETED,
				},
			},
		});
	}

	async updateRole(roleID, roleName, departmetID, status, userDetail) {
		const currentDate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
		return await UserRole.update({
				role_name: roleName,
				department_id: departmetID,
				updated_by: userDetail.id,
				updated_at: currentDate,
				status: status && status === "1" ? this.STATUS_ACTIVE : this.STATUS_INACTIVE,
			}, {
				where: {
					id: roleID,
					created_by: userDetail.id,
					status: {
						[Op.ne]: this.STATUS_DELETED,
					},
				},
			})
			.then((data) => {
				return true;
			})
			.catch((err) => {
				logger.error("Unable to update user role");
				logger.error(err);
				return false;
			});
	}

	async deleteRole(roleID, userDetail) {
		const currentDate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
		return await UserRole.update({
				status: this.STATUS_DELETED,
				updated_by: userDetail.id,
				updated_at: currentDate,
			}, {
				where: {
					id: roleID,
					created_by: userDetail.id,
					status: {
						[Op.ne]: this.STATUS_DELETED,
					},
				},
			})
			.then((data) => {
				return true;
			})
			.catch((err) => {
				logger.error("Unable to delete user role");
				logger.error(err);
				return false;
			});
	}

}

/**
 * Initialize the model, by defining the table schema.
 */
UserRole.init({
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
	role_name: {
		type: DataTypes.STRING(255),
		allowNull: false,
	},
	department_id: {
		type: DataTypes.INTEGER(),
		allowNull: false,
		defaultValue: 0,
	},
}, {
	sequelize,
	modelName: "m_user_roles",
	timestamps: false,
});

/**
 * Export the model, so that it can be used in any
 * page to execute CRUD operations on the table.
 */
module.exports = UserRole;