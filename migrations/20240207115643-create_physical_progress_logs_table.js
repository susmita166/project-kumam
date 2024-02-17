'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		queryInterface.createTable('t_physical_progress_logs', {
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
			physical_progress_id: {
				type: Sequelize.DataTypes.BIGINT,
				allowNull: false,
				defaultValue: 0
			},
			work_order_id: {
				type: Sequelize.DataTypes.BIGINT,
				allowNull: false,
				defaultValue: 0
			},
			work_order_status: {
				type: Sequelize.DataTypes.ENUM(['1', '2', '3']),
				allowNull: false,
				defaultValue: "1",
				comment: '1 (Not Started), 2 (In Progress), 3 (Completed)'
			},
			expected_commencement_date: {
				type: Sequelize.DataTypes.DATE,
				allowNull: true,
			},
			expected_completion_date: {
				type: Sequelize.DataTypes.DATE,
				allowNull: true,
			},
			completion_date: {
				type: Sequelize.DataTypes.DATE,
				allowNull: true,
			},
		})
	},

	async down(queryInterface, Sequelize) {

	}
};