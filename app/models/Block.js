const {
	Model,
	DataTypes,
	Op
} = require('sequelize');
const sequelize = require("../../util/database");
const logger = require('../../util/logger');
const moment = require('moment');

class Block extends Model {

	static STATUS_DELETED = "0";
	static STATUS_ACTIVE = "1";
	static STATUS_INACTIVE = "2";

	async createBlock(blockData, userDetail, status) {
		const currentDate = moment().format("YYYY-MM-DD HH:mm:ss");
		return await Block.create({
			district_id: blockData.district_id,
			name: blockData.name,
			status: (status == '1') ? this.STATUS_ACTIVE : this.STATUS_INACTIVE,
			created_by: userDetail.id,
			created_at: currentDate,
			updated_by: userDetail.id,
			updated_at: currentDate,
		}).then(data => {
			return true;
		}).catch(err => {
			logger.error("Unable to add block.");
			logger.error(err);
			return false;
		});
	}

	static async fetchAllBlocks(districtIDs) {
		let whereConditions = {
			status: {
				[Op.ne]: this.STATUS_DELETED
			}
		};
		if (districtIDs && districtIDs.length > 0) {
			whereConditions.district_id = {
				[Op.in]: districtIDs
			};
		}
		try {
			const blockData = await Block.findAll({
				attributes: {
					exclude: ['created_by', 'updated_by']
				},
				where: whereConditions
			});
			return blockData;
		} catch (error) {
			logger.error(error);
			return [];
		}
	}

	static async fetchBlockDetailByID(id) {
		return await Block.findOne({
			attributes: {
				exclude: ["created_by", "updated_by"],
			},
			where: {
				id: id,
				status: {
					[Op.ne]: this.STATUS_DELETED,
				},
			},
		}).then(data => {
			return data;
		}).catch(err => {
			logger.error("Unable to retrieve Block Details .");
			logger.error(err);
			return null;
		});

	}

	static async updateBlock(updateData, userDetail) {
		const currentDate = moment().format("YYYY-MM-DD HH:mm:ss");
		const {
			id
		} = updateData;
		return await Block.update({
			district_id:updateData.district_id,
			name: updateData.name,
			status: updateData.status == '1' ? this.STATUS_ACTIVE : this.STATUS_INACTIVE,
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
			logger.error("Unable to edit block.");
			logger.error(err);
			return false;
		});
	}

	static async deleteBlockByID(id, userDetail) {
		const currentDate = moment().format("YYYY-MM-DD HH:mm:ss");
		return await Block.update({
			status: this.STATUS_DELETED,
			updated_by: userDetail.id,
			updated_at: currentDate,
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
			logger.error("Unable to delete block.");
			logger.error(err);
			return false;
		});
	}

	static async countAllBlocks() {
		return await Block.count({
			where: {
				status: {
					[Op.ne]: this.STATUS_DELETED
				}
			}
		}).then(data => {
			return data;
		}).catch(err => {
			logger.error("Unable to count block list.");
			logger.error(err);
			return 0;
		});
	}
}

/**
 * Initialize the model, by defining the table schema.
 */
Block.init({
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
	district_id: DataTypes.INTEGER,
	name: DataTypes.STRING
}, {
	sequelize,
	modelName: 'm_blocks',
	timestamps: false
});

module.exports = Block;