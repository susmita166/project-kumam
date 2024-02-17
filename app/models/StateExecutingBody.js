const {
	Model,
	DataTypes,
	Op
} = require('sequelize');
const sequelize = require("../../util/database")
const logger = require('../../util/logger');
const moment = require('moment');

class StateExecutingBody extends Model {

	static STATUS_DELETED = "0";
	static STATUS_ACTIVE = "1";
	static STATUS_INACTIVE = "2";

	static async fetchStateExecutingBodyDetailsByID(id) {
		try {
			return await StateExecutingBody.findOne({
				attributes: {
					exclude: ["created_by", "updated_by"]
				},
				where: {
					id: id,
					status: {
						[Op.ne]: this.STATUS_DELETED,
					},
				},
			});
		} catch (error) {
			logger.error("Error while fetching the state executing body detail.");
			logger.error(error);
			return null;
		}
	}

	async addStateExecuting(stateExecutingData, userDetail) {
		const currentDate = moment().format("YYYY-MM-DD HH:mm:ss");
		return await StateExecutingBody.create({
			state_id: stateExecutingData.state_id,
			department_id: stateExecutingData.department_id,
			name: stateExecutingData.name,
			description: stateExecutingData.description,
			status: stateExecutingData.status == '1' ? this.STATUS_ACTIVE : this.STATUS_INACTIVE,
			created_by: userDetail.id,
			created_at: currentDate,
			updated_by: userDetail.id,
			updated_at: currentDate,
		}).then(data => {
			return true;
		}).catch(err => {
			logger.error("Unable to retrieve Scheme Details .");
			logger.error(err);
			return false;
		});
	}

	static async fetchAllStateExecutingBodies(state_id, department_id) {

		return await StateExecutingBody.findAll({
			attributes: {
				exclude: ['created_by', 'updated_by']
			},
			where: {
				state_id: state_id,
				department_id: department_id,
				status: {
					[Op.ne]: this.STATUS_DELETED
				}
			}
		}).then(data => {
			return data;
		}).catch(err => {
			logger.error("Unable to retrieve State executing list .");
			logger.error(err);
			return [];
		});
	}

	static async editStateExecuting(editedata, userDetail) {
		const currentDate = moment().format("YYYY-MM-DD HH:mm:ss");
		const {
			id
		} = editedata;
		return await StateExecutingBody.update({
			state_id: editedata.state_id,
			department_id: editedata.department_id,
			name: editedata.name,
			description: editedata.description,
			status: editedata.status == '1' ? this.STATUS_ACTIVE : this.STATUS_INACTIVE,
			updated_by: userDetail.id,
			updated_at: currentDate,
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
			logger.error("Unable to edit state executing body .");
			logger.error(err);
			return false;
		});
	}

	static async deleteStateExecuting(id, userDetail) {
		try {
			const currentDate = moment().format("YYYY-MM-DD HH:mm:ss");
			const data = await StateExecutingBody.update({
				status: this.STATUS_DELETED,
				updated_by: userDetail.id,
				updated_at: currentDate,
			}, {
				where: {
					id: id,
					created_by: userDetail.id,
					status: {
						[Op.ne]: this.STATUS_DELETED
					}
				}
			});
			return data;
		} catch (err) {
			logger.error("Unable to delete state executing body .");
			logger.error(err);
			return false;
		}
	}

	static async countAllStateExecutingBodies() {
		return await StateExecutingBody.count({
			where: {
				status: {
					[Op.ne]: this.STATUS_DELETED
				}
			}
		}).then(data => {
			return data;
		}).catch(err => {
			logger.error("Unable to count state executing bodies list.");
			logger.error(err);
			return 0;
		});
	}
}

StateExecutingBody.init({
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
	state_id: DataTypes.INTEGER,
	department_id: DataTypes.INTEGER,
	name: DataTypes.STRING,
	description: DataTypes.STRING,
}, {
	sequelize,
	modelName: 'm_state_executing_bodies',
	timestamps: false,
});

module.exports = StateExecutingBody;