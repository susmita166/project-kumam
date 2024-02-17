const {
	Model,
	DataTypes,
	Op
} = require('sequelize');
const sequelize = require("../../util/database");
const logger = require('../../util/logger');
const moment = require('moment');

class UrbanLocalBodyType extends Model {

	static STATUS_DELETED = "0";
	static STATUS_ACTIVE = "1";
	static STATUS_INACTIVE = "2";

    allFields = ['id', 'created_by', 'created_at', 'updated_by', 'updated_at', 'status', 'name'];
    selectiveFields = ['id', 'created_at', 'updated_at', 'status', 'name'];

	static async createType(name, status, userDetail) {
		const currentDate = moment().format("YYYY-MM-DD HH:mm:ss");
        return await UrbanLocalBodyType.create({
            created_by: userDetail.id,
            created_at: currentDate,
            updated_by: userDetail.id,
            updated_at: currentDate,
            status: status == '1' ? this.STATUS_ACTIVE : this.STATUS_INACTIVE,
            name: name,
        });
	}

	static async fetchAllTypes(getSelectiveFields = false) {
		return await UrbanLocalBodyType.findAll({
            attributes: (getSelectiveFields) ? this.selectiveFields : this.allFields,
            where: {
                status: {
                    [Op.ne]: this.STATUS_DELETED
                }
            }
        });
	}

	static async fetchTypeDetailsByID(typeID, getSelectiveFields = false) {
		return await UrbanLocalBodyType.findOne({
			attributes: (getSelectiveFields) ? this.selectiveFields : this.allFields,
			where: {
				id: typeID,
				status: {
					[Op.ne]: this.STATUS_DELETED
				}
			}
		}).then(data => {
			return data;
		}).catch(err => {
			logger.error("Unable to retrieve ulb type details.");
			logger.error(err);
			return null;
		});
	}

	static async updateType(id, name, status, userDetail) {
		const currentDate = moment().format("YYYY-MM-DD HH:mm:ss");
		return await UrbanLocalBodyType.update({
			name: name,
			status: status == '1' ? this.STATUS_ACTIVE : this.STATUS_INACTIVE,
			updated_by: userDetail.id,
			updated_at: currentDate,
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
			logger.error("Unable to edit ulb type.");
			logger.error(err);
			return false;
		});
	}

	static async deleteType(id, userDetail) {
		const currentDate = moment().format("YYYY-MM-DD HH:mm:ss");
		return await UrbanLocalBodyType.update({
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
			logger.error("Unable to delete ulb type.");
			logger.error(err);
			return false;
		});
	}

	static async countAllTypes() {
		return await UrbanLocalBodyType.count({
			where: {
				status: {
					[Op.ne]: this.STATUS_DELETED
				}
			}
		}).then(data => {
			return data;
		}).catch(err => {
			logger.error("Unable to count urban local body type list.");
			logger.error(err);
			return 0;
		});
	}
}

UrbanLocalBodyType.init({
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
	modelName: 'm_urban_local_body_types',
	timestamps: false
});

module.exports = UrbanLocalBodyType;