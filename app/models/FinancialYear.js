const {
    Sequelize,
    DataTypes,
    Model,
    Op
} = require("sequelize");
const sequelize = require("../../util/database");
const logger = require('../../util/logger');
const moment = require('moment');

class FinancialYear extends Model {

    STATUS_DELETED = "0";
    STATUS_ACTIVE = "1";
    STATUS_INACTIVE = "2";

    allFields = ['id', 'created_by', 'created_at', 'updated_by', 'updated_at', 'status', 'name'];
    selectiveFields = ['id', 'created_at', 'updated_at', 'status', 'name'];

    async fetchFinancialYearDetailByName(name, getSelectiveFields = false) {
        return await FinancialYear.findOne({
            attributes: (getSelectiveFields) ? this.selectiveFields : this.allFields,
            where: {
                name: name,
                status: {
                    [Op.ne]: this.STATUS_DELETED
                }
            }
        });
    }

    async fetchFinancialYearDetailByID(id, getSelectiveFields = false) {
        return await FinancialYear.findOne({
            attributes: (getSelectiveFields) ? this.selectiveFields : this.allFields,
            where: {
                id: id,
                status: {
                    [Op.ne]: this.STATUS_DELETED
                }
            }
        });
    }

    async addFinancialYear(name, status, userDetail) {
        const currentDate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        return await FinancialYear.create({
            created_by: userDetail.id,
            created_at: currentDate,
            updated_by: userDetail.id,
            updated_at: currentDate,
            status: (status == '1') ? this.STATUS_ACTIVE : this.STATUS_INACTIVE,
            name: name
        }).then(data => {
            return true;
        }).catch(err => {
            logger.error("Unable to add financial year.");
            logger.error(err);
            return false;
        });
    }

    async fetchAllFinancialYears(getSelectiveFields = false) {
        return await FinancialYear.findAll({
            attributes: (getSelectiveFields) ? this.selectiveFields : this.allFields,
            where: {
                status: {
                    [Op.ne]: this.STATUS_DELETED
                }
            }
        });
    }

    async editFinancialYear(id, name, status, userDetail) {
        const currentDate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        return await FinancialYear.update({
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
            logger.error("Unable to edit financial year.");
            logger.error(err);
            return false;
        });
    }

    async deleteFinancialYear(id, userDetail) {
        const currentDate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        return await FinancialYear.update({
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
            logger.error("Unable to delete financial year.");
            logger.error(err);
            return false;
        });
    }

    static async countAllFinancialYears() {
        return await FinancialYear.count({
			where: {
				status: {
					[Op.ne]: this.STATUS_DELETED
				}
			}
		}).then(data => {
			return data;
		}).catch(err => {
			logger.error("Unable to count financial years list.");
			logger.error(err);
			return 0;
		});
    }
}

/**
 * Initialize the model, by defining the table schema.
 */
FinancialYear.init({
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
    modelName: "m_financial_years",
    timestamps: false
});

/**
 * Export the model, so that it can be used in any
 * page to execute CRUD operations on the table.
 */
module.exports = FinancialYear;