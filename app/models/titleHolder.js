const {
	Model,
	DataTypes,
	Op
} = require('sequelize');
const sequelize = require("../../util/database");
const logger = require('../../util/logger');
const moment = require('moment');

class titleHolder extends Model {

	static STATUS_DELETED = "0";
	static STATUS_ACTIVE = "1";
	static STATUS_INACTIVE = "2";

	async createWaterBody(titleHolderData, status, userDetail) {
		const currentDate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
		return await titleHolder.create({
			name: titleHolderData.name,
			status: (status == '1') ? this.STATUS_ACTIVE : this.STATUS_INACTIVE,
			created_by: userDetail.id,
			created_at: currentDate,
			updated_by: userDetail.id,
			updated_at: currentDate,
		}).then(data => {
			return true;
		}).catch(err => {
			logger.error("Unable to add Title Holder Data.");
			logger.error(err);
			return false;
		});
	}

    static async fetchAlltitleHolder() {
		return await titleHolder.findAll({
			attributes: {
				exclude: ['created_by', 'updated_by']
			},
			where: {
				status: {
					[Op.ne]: this.STATUS_DELETED
				}
			}
		}).then(data => {
			return data;
		}).catch(err => {
			logger.error("Unable to retrieve Title Holder List.");
			logger.error(err);
			return [];
		});
	}

    static async updatetitleHolderByID(updatedData, userDetail) {
        const currentDate = moment().format("YYYY-MM-DD HH:mm:ss");
        const {
          id
        } = updatedData;
        return await titleHolder.update({
          name: updatedData.name,
          status: updatedData.status == '1' ? this.STATUS_ACTIVE : this.STATUS_INACTIVE,
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
          logger.error("Unable to edit Test.");
          logger.error(err);
          return false;
        });
    }

    static async deletetitleHolderByID(id, userDetail) {
        const currentDate = moment().format("YYYY-MM-DD HH:mm:ss");
        return await titleHolder.update({
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
          logger.error("Unable to delete.");
          logger.error(err);
          return false;
        });
    }

	static async detailstitleHolderByID(titleHolderId) {
		return await titleHolder.findOne({
			attributes: {
				exclude: ['created_by', 'updated_by']
			},
			where: {
				id: titleHolderId,
				status: {
					[Op.ne]: this.STATUS_DELETED
				}
			}
		}).then(data => {
			return data;
		}).catch(err => {
			logger.error("Unable to retrieve Title Holder details.");
			logger.error(err);
			return null;
		});
	}
}

titleHolder.init({
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
        allowNull: false
    }
}, {
	sequelize,
	modelName: 't_title_holders',
	timestamps: false
});

module.exports = titleHolder;