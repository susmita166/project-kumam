const {
    Sequelize,
    DataTypes,
    Model,
    Op
} = require("sequelize");
const sequelize = require("../../util/database");
const logger = require('../../util/logger');
const moment = require("moment");

class UserToULB extends Model {

    STATUS_DELETED = "0";
    STATUS_ACTIVE = "1";
    STATUS_INACTIVE = "2";

    static async addUserToUlb(userID, ulbID, userDetail) {
        const currentDate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        return await UserToULB.create({
            created_by: userDetail.id,
            created_at: currentDate,
            updated_by: userDetail.id,
            updated_at: currentDate,
            status: this.STATUS_ACTIVE,
            user_id: userID,
            ulb_id: ulbID
        }).then(data => {
            return true;
        }).catch(err => {
            logger.error('Unable to create user to ulb map.');
            logger.error(err);
            return false;
        });
    }

    static async fetchUlbMappedToUser(userID) {
        try {
            return await UserToULB.findOne({
                status: this.STATUS_ACTIVE,
                user_id: userID
            }).then(data => {
                return data;
            }).catch(err => {
                logger.error('Unable to create user to ulb map.');
                logger.error(err);
                return null;
            });
        } catch (err) {
            logger.error('Unable to create user to ulb map.');
            logger.error(err);
            return null;
        }
    }
    
}

/**
 * Initialize the model, by defining the table schema.
 */
UserToULB.init({
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
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    ulb_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
}, {
    sequelize,
    modelName: "t_users_to_ulb_map",
    freezeTableName: true,
    timestamps: false
});

/**
 * Export the model, so that it can be used in any
 * page to execute CRUD operations on the table.
 */
module.exports = UserToULB;