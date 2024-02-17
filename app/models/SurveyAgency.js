const {
    Sequelize,
    DataTypes,
    Model,
    Op
} = require("sequelize");
const sequelize = require("../../util/database");
const logger = require('../../util/logger');
const moment = require('moment');

class SurveyAgency extends Model {

    STATUS_DELETED = "0";
    STATUS_ACTIVE = "1";
    STATUS_INACTIVE = "2";

    allFields = ['id', 'created_by', 'created_at', 'updated_by', 'updated_at', 'status', 'name', 'address_one', 'address_two', 'zipcode'];
    selectiveFields = ['id', 'created_at', 'updated_at', 'status', 'name', 'address_one', 'address_two', 'zipcode'];

    async fetchSurveyAgencyDetailByName(name, getSelectiveFields = false) {
        // Return the survey agency details
        return await SurveyAgency.findOne({
            attributes: (getSelectiveFields) ? this.selectiveFields : this.allFields,
            where: {
                name: name, // Find the survey agency by name
                status: {
                    [Op.ne]: this.STATUS_DELETED
                }
            }
        });
    }

    async fetchSurveyAgencyDetailByID(id, getSelectiveFields = false) {
        // Retrieve the survey agency details from the database based on the provided ID
        return await SurveyAgency.findOne({
            attributes: (getSelectiveFields) ? this.selectiveFields : this.allFields,
            where: {
                id: id,
                status: {
                    [Op.ne]: this.STATUS_DELETED
                }
            }
        });
    }

    async addSurveyAgency(name, addressOne, addressTwo, zipCode, status, userDetail) {
        // Get the current date and time in the specified format
        const currentDate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        // Create a new Survey agency in the database using the provided data
        return await SurveyAgency.create({
            created_by: userDetail.id,
            created_at: currentDate,
            updated_by: userDetail.id,
            updated_at: currentDate,
            status: (status == '1') ? this.STATUS_ACTIVE : this.STATUS_INACTIVE,
            name: name,
            address_one: addressOne,
            address_two: addressTwo,
            zipcode: zipCode,
        }).then(data => {
            // Return true if the creation was successful
            return true;
        }).catch(err => {
            // Log the error and return false if the cration is failed
            logger.error("Unable to add survey agency.");
            logger.error(err);
            return false;
        });
    }

    async fetchAllSurveyAgencies(getSelectiveFields = false) {
        // Retrieve all survey agencies from the database
        return await SurveyAgency.findAll({
            attributes: (getSelectiveFields) ? this.selectiveFields : this.allFields,
            where: {
                status: {
                    [Op.ne]: this.STATUS_DELETED
                }
            }
        });
    }

    async editSurveyAgency(id, name, addressOne, addressTwo, zipCode, status, userDetail) {
        // Get the current date and time
        const currentDate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        // Update the survey agency details in the database
        return await SurveyAgency.update({
            updated_by: userDetail.id,
            updated_at: currentDate,
            status: (status == '1') ? this.STATUS_ACTIVE : this.STATUS_INACTIVE,
            name: name,
            address_one: addressOne,
            address_two: addressTwo,
            zipcode: zipCode,
        }, {
            where: {
                id: id,
                status: {
                    [Op.ne]: this.STATUS_DELETED
                }
            }
        }).then(data => {
            // Return true if the update was successful
            return true;
        }).catch(err => {
            // Log the error and return false if the update failed
            logger.error("Unable to edit survey agency.");
            logger.error(err);
            return false;
        });
    }

    async deleteSurveyAgency(id, userDetail) {
        // Get the current date and time
        const currentDate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        // Mark the survey agency as archived in the database
        return await SurveyAgency.update({
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
            // Return true if the delete operation was successful
            return true;
        }).catch(err => {
            // Log the error and return false if the delete operation failed
            logger.error("Unable to delete survey agency.");
            logger.error(err);
            return false;
        });
    }

    static async countAllSurveyAgencies() {
        return await SurveyAgency.count({
			where: {
				status: {
					[Op.ne]: this.STATUS_DELETED
				}
			}
		}).then(data => {
			return data;
		}).catch(err => {
			logger.error("Unable to count survey agencies list.");
			logger.error(err);
			return 0;
		});
    }
}

/**
 * Initialize the model, by defining the table schema.
 */
SurveyAgency.init({
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
    address_one: {
        type: DataTypes.STRING(512),
        allowNull: true,
    },
    address_two: {
        type: DataTypes.STRING(512),
        allowNull: true,
    },
    zipcode: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
}, {
    sequelize,
    modelName: "m_survey_agencies",
    timestamps: false
});

/**
 * Export the model, so that it can be used in any
 * page to execute CRUD operations on the table.
 */
module.exports = SurveyAgency;