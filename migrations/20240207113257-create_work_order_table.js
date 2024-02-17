'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		queryInterface.createTable('t_work_orders', {
			id: {
				type: Sequelize.DataTypes.BIGINT.UNSIGNED,
				autoIncrement: true,
				allowNull: false,
				primaryKey: true,
			},
			created_by: {
				type: Sequelize.DataTypes.BIGINT.UNSIGNED,
				allowNull: false,
				defaultValue: 0
			},
			created_at: {
				type: Sequelize.DataTypes.DATE,
				allowNull: false,
			},
			updated_by: {
				type: Sequelize.DataTypes.BIGINT.UNSIGNED,
				allowNull: false,
				defaultValue: 0
			},
			updated_at: {
				type: Sequelize.DataTypes.DATE,
				allowNull: false,
			},
			status: {
				type: Sequelize.DataTypes.ENUM(['0', '1', '2']),
				comment: "0 (Deleted), 1 (Active), 2 (Inactive)",
				allowNull: false,
				defaultValue: "1"
			},
			water_body_id: {
				type: Sequelize.DataTypes.BIGINT,
				allowNull: false,
				defaultValue: 0
			},
			msg_id: {
				type: Sequelize.DataTypes.BIGINT,
				allowNull: false,
				defaultValue: 0
			},
			work_order_no: {
				type: Sequelize.DataTypes.BIGINT,
				allowNull: false,
				defaultValue: 0
			},
			amount: {
				type: Sequelize.DataTypes.DECIMAL(20,2),
				allowNull: false,
				defaultValue: 0,
				comment: 'In Lakhs'
			},
			source_of_funds_id: {
				type: Sequelize.DataTypes.INTEGER,
				allowNull: false,
				defaultValue: 0
			},
			work_commencement_date: {
				type: Sequelize.DataTypes.DATE,
				allowNull: true
			},
			stipulated_completion_date: {
				type: Sequelize.DataTypes.DATE,
				allowNull: true
			},
			work_duration: {
				type: Sequelize.DataTypes.INTEGER,
				allowNull: false,
				defaultValue: 0,
				comment: 'In Days'
			},
			work_order_file_name: {
				type: Sequelize.DataTypes.STRING(255),
				allowNull: true
			}
		})
	},

	async down(queryInterface, Sequelize) {

	}
};