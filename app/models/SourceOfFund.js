const {
    Sequelize,
    DataTypes,
    Model,
    Op
} = require("sequelize");
const sequelize = require("../../util/database");
const logger = require('../../util/logger');
const moment = require('moment');

class SourceOfFund extends Model {

    STATUS_DELETED = "0";
    STATUS_ACTIVE = "1";
    STATUS_INACTIVE = "2";

    allFields = ['id', 'created_by', 'created_at', 'updated_by', 'updated_at', 'status', 'name'];
    selectiveFields = ['id', 'created_at', 'updated_at', 'status', 'name'];

    async fetchSourceOfFundDetailByName(name, getSelectiveFields = false) {
        return await SourceOfFund.findOne({
            attributes: (getSelectiveFields) ? this.selectiveFields : this.allFields,
            where: {
                name: name,
                status: {
                    [Op.ne]: this.STATUS_DELETED
                }
            }
        });
    }

    async fetchSourceOfFundDetailByID(id, getSelectiveFields = false) {
        return await SourceOfFund.findOne({
            attributes: (getSelectiveFields) ? this.selectiveFields : this.allFields,
            where: {
                id: id,
                status: {
                    [Op.ne]: this.STATUS_DELETED
                }
            }
        });
    }

    async addSourceOfFund(name, status, userDetail) {
        const currentDate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        return await SourceOfFund.create({
            created_by: userDetail.id,
            created_at: currentDate,
            updated_by: userDetail.id,
            updated_at: currentDate,
            status: (status == '1') ? this.STATUS_ACTIVE : this.STATUS_INACTIVE,
            name: name
        }).then(data => {
            return true;
        }).catch(err => {
            logger.error("Unable to add source of fund.");
            logger.error(err);
            return false;
        });
    }

    async fetchAllSourceOfFunds(getSelectiveFields = false) {
        return await SourceOfFund.findAll({
            attributes: (getSelectiveFields) ? this.selectiveFields : this.allFields,
            where: {
                status: {
                    [Op.ne]: this.STATUS_DELETED
                }
            }
        });
    }

    async editSourceOfFund(id, name, status, userDetail) {
        const currentDate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        return await SourceOfFund.update({
            updated_by: userDetail.id,
            updated_at: currentDate,
            status: (status == '1') ? this.STATUS_ACTIVE : this.STATUS_INACTIVE,
            name: name
        }, {
            where: {
                id: id,
                status: {
                    [Op.ne]: this.STATUS_DELETED
                }
            }
        }).then(data => {
            return true;
        }).catch(err => {
            logger.error("Unable to edit source of fund.");
            logger.error(err);
            return false;
        });
    }

    async deleteSourceOfFund(id, userDetail) {
        const currentDate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        return await SourceOfFund.update({
            updated_by: userDetail.id,
            updated_at: currentDate,
            status: this.STATUS_DELETED
        }, {
            where: {
                id: id,
                status: {
                    [Op.ne]: this.STATUS_DELETED
                }
            }
        }).then(data => {
            return true;
        }).catch(err => {
            logger.error("Unable to delete source of fund.");
            logger.error(err);
            return false;
        });
    }

    static async countAllSourceOfFunds() {
        return await SourceOfFund.count({
			where: {
				status: {
					[Op.ne]: this.STATUS_DELETED
				}
			}
		}).then(data => {
			return data;
		}).catch(err => {
			logger.error("Unable to count source of funds list.");
			logger.error(err);
			return 0;
		});
    }
}

/**
 * Initialize the model, by defining the table schema.
 */
SourceOfFund.init({
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
    modelName: "m_source_of_funds",
    timestamps: false
});

/**
 * Export the model, so that it can be used in any
 * page to execute CRUD operations on the table.
 */
module.exports = SourceOfFund;