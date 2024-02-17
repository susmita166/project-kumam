const {
	Model,
	DataTypes,
	Op
} = require('sequelize');
const sequelize = require("../../util/database");
const logger = require('../../util/logger');
const moment = require('moment');

class State extends Model {

	static STATUS_DELETED = "0";
	static STATUS_ACTIVE = "1";
	static STATUS_INACTIVE = "2";

	async createState(stateData, status, userDetail) {
		const currentDate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
		return await State.create({
			name: stateData.name,
			code: stateData.code,
			status: (status == '1') ? this.STATUS_ACTIVE : this.STATUS_INACTIVE,
			created_by: userDetail.id,
			created_at: currentDate,
			updated_by: userDetail.id,
			updated_at: currentDate,
		}).then(data => {
			return true;
		}).catch(err => {
			logger.error("Unable to add state.");
			logger.error(err);
			return false;
		});
	}

	static async fetchAllStates() {
		return await State.findAll({
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
			logger.error("Unable to retrieve State List.");
			logger.error(err);
			return [];
		});
	}

	static async fetchStateDetailsByID(stateID) {
		return await State.findOne({
			attributes: {
				exclude: ['created_by', 'updated_by']
			},
			where: {
				id: stateID,
				status: {
					[Op.ne]: this.STATUS_DELETED
				}
			}
		}).then(data => {
			return data;
		}).catch(err => {
			logger.error("Unable to retrieve state details.");
			logger.error(err);
			return null;
		});
	}

	static async updateStateByID(updatedData, userDetail) {
		const currentDate = moment().format("YYYY-MM-DD HH:mm:ss");
		const {
			id
		} = updatedData;
		return await State.update({
			name: updatedData.name,
			code: updatedData.code,
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
			logger.error("Unable to edit State.");
			logger.error(err);
			return false;
		});
	}


	static async deleteStateByID(id, userDetail) {
		const currentDate = moment().format("YYYY-MM-DD HH:mm:ss");
		return await State.update({
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
			logger.error("Unable to delete State.");
			logger.error(err);
			return false;
		});
	}

	static async countAllStates() {
		return await State.count({
			where: {
				status: {
					[Op.ne]: this.STATUS_DELETED
				}
			}
		}).then(data => {
			return data;
		}).catch(err => {
			logger.error("Unable to count state list.");
			logger.error(err);
			return 0;
		});
	}

}

State.init({
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
	name: DataTypes.STRING,
	code: DataTypes.STRING,
}, {
	sequelize,
	modelName: 'm_states',
	timestamps: false
});

module.exports = State;