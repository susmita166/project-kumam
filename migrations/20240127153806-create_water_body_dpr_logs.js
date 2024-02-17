'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('t_water_body_dprs_logs', {
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
				comment: "0 (Archived), 1 (Active), 2 (Inactive)",
				allowNull: false,
				defaultValue: "1"
			},
			dpr_id: {
				type: Sequelize.DataTypes.BIGINT,
				allowNull: false,
				defaultValue: 0
			},
			vendor_id: {
				type: Sequelize.DataTypes.BIGINT,
				allowNull: false,
				defaultValue: 0
			},
			preparation_date: {
				type: Sequelize.DataTypes.DATE,
				allowNull: true,
				defaultValue: null
			},
			physical_progress_percentage: {
				type: Sequelize.DataTypes.DECIMAL(10,2),
				allowNull: false,
				defaultValue: 0
			},
			sanctioned_amount: {
				type: Sequelize.DataTypes.DECIMAL(20,2),
				allowNull: false,
				defaultValue: 0,
				comment: 'In Lakhs'
			},
			expected_completion_date: {
				type: Sequelize.DataTypes.DATE,
				allowNull: true,
				defaultValue: null,
			},
			pending_work_detail: {
				type: Sequelize.DataTypes.TEXT,
				allowNull: true,
				defaultValue: null,
			},
		});
	},

	async down(queryInterface, Sequelize) {}
};