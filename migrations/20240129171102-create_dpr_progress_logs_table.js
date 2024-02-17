'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('t_water_body_dpr_progress_logs', {
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
			dpr_progress_id: {
				type: Sequelize.DataTypes.BIGINT,
				allowNull: false,
				defaultValue: 0
			},
			hsc_completion_date: {
				type: Sequelize.DataTypes.DATE,
				allowNull: true,
				defaultValue: null,
			},
			hsc_condition: {
				type: Sequelize.DataTypes.ENUM(['1', '2', '3']),
				allowNull: true,
				defaultValue: null,
				comment: '1 (Healthy), 2 (Degraded), 3 (Severely Degraded)',
			},
			hsc_report_file_name: {
				type: Sequelize.DataTypes.STRING(255),
				allowNull: true,
				defaultValue: null,
			},
			ds_completion_date: {
				type: Sequelize.DataTypes.DATE,
				allowNull: true,
				defaultValue: null,
			},
			ds_report_file_name: {
				type: Sequelize.DataTypes.STRING(255),
				allowNull: true,
				defaultValue: null,
			},
			bs_completion_date: {
				type: Sequelize.DataTypes.DATE,
				allowNull: true,
				defaultValue: null,
			},
			bs_report_file_name: {
				type: Sequelize.DataTypes.STRING(255),
				allowNull: true,
				defaultValue: null,
			},
			wt_completion_date: {
				type: Sequelize.DataTypes.DATE,
				allowNull: true,
				defaultValue: null,
			},
			wt_bod: {
				type: Sequelize.DataTypes.DECIMAL(12,2),
				allowNull: false,
				defaultValue: 0,
				comment: 'Biochemical Oxygen Demand'
			},
			wt_cod: {
				type: Sequelize.DataTypes.DECIMAL(12,2),
				allowNull: false,
				defaultValue: 0,
				comment: 'Chemical Oxygen Demand'
			},
			wt_do: {
				type: Sequelize.DataTypes.DECIMAL(12,2),
				allowNull: false,
				defaultValue: 0,
				comment: 'Dissolved Oxygen'
			},
			wt_tds: {
				type: Sequelize.DataTypes.DECIMAL(12,2),
				allowNull: false,
				defaultValue: 0,
				comment: 'Total Dissolved Solids'
			},
			wt_turbidity: {
				type: Sequelize.DataTypes.DECIMAL(12,2),
				allowNull: false,
				defaultValue: 0,
				comment: 'Water Clarity'
			},
			wt_report_file_name: {
				type: Sequelize.DataTypes.STRING(255),
				allowNull: true,
				defaultValue: null,
			},
			ld_completion_date: {
				type: Sequelize.DataTypes.DATE,
				allowNull: true,
				defaultValue: null,
			},
			ld_drawing_file_name: {
				type: Sequelize.DataTypes.STRING(255),
				allowNull: true,
				defaultValue: null,
			},
			wru_submission_date: {
				type: Sequelize.DataTypes.DATE,
				allowNull: true,
				defaultValue: null,
			},
			wru_amount: {
				type: Sequelize.DataTypes.DECIMAL(20,2),
				allowNull: false,
				defaultValue: 0,
				comment: 'In Lakhs'
			},
			wru_dpr_file_name: {
				type: Sequelize.DataTypes.STRING(255),
				allowNull: true,
				defaultValue: null,
			},
			oe_submission_date: {
				type: Sequelize.DataTypes.DATE,
				allowNull: true,
				defaultValue: null,
			},
			oe_amount: {
				type: Sequelize.DataTypes.DECIMAL(20,2),
				allowNull: false,
				defaultValue: 0,
				comment: 'In Lakhs'
			},
			oe_dpr_file_name: {
				type: Sequelize.DataTypes.STRING(255),
				allowNull: true,
				defaultValue: null,
			},
			ea_approval_date: {
				type: Sequelize.DataTypes.DATE,
				allowNull: true,
				defaultValue: null,
			},
			ea_amount: {
				type: Sequelize.DataTypes.DECIMAL(20,2),
				allowNull: false,
				defaultValue: 0,
				comment: 'In Lakhs'
			},
			ea_approval_letter_file_name: {
				type: Sequelize.DataTypes.STRING(255),
				allowNull: true,
				defaultValue: null,
			},
			ea_dpr_file_name: {
				type: Sequelize.DataTypes.STRING(255),
				allowNull: true,
				defaultValue: null,
			},
		});
	},

	async down(queryInterface, Sequelize) {

	}
};