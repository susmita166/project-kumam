'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		queryInterface.createTable('t_payments', {
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
			work_order_id: {
				type: Sequelize.DataTypes.BIGINT,
				allowNull: false,
				defaultValue: 0
			},
			is_final: {
				type: Sequelize.DataTypes.ENUM(['0', '1']),
				comment: "0 (No), 1 (Yes)",
				allowNull: false,
				defaultValue: "0"
			},
			bill_serial_no: {
				type: Sequelize.DataTypes.BIGINT,
				allowNull: false,
				defaultValue: 0
			},
			work_completion_date: {
				type: Sequelize.DataTypes.DATE,
				allowNull: true
			},
			last_work_done_date: {
				type: Sequelize.DataTypes.DATE,
				allowNull: true
			},
			measurement_date: {
				type: Sequelize.DataTypes.DATE,
				allowNull: true
			},
			work_done_amount: {
				type: Sequelize.DataTypes.DECIMAL(30,2),
				allowNull: false,
				defaultValue: 0,
				comment: 'In Lakhs'
			},
			payment_released_amount: {
				type: Sequelize.DataTypes.DECIMAL(30,2),
				allowNull: false,
				defaultValue: 0,
				comment: 'In Lakhs'
			},
			payment_released_percent: {
				type: Sequelize.DataTypes.DECIMAL(30,2),
				allowNull: false,
				defaultValue: 0,
				comment: '(payment released / work done amount) * 100'
			},
			outstanding_amount: {
				type: Sequelize.DataTypes.DECIMAL(30,2),
				allowNull: false,
				defaultValue: 0,
				comment: 'In Lakhs (work done amount - payment released)',
			},
			bill_document: {
				type: Sequelize.DataTypes.STRING(255),
				allowNull: true
			},
			remarks: {
				type: Sequelize.DataTypes.STRING(4096),
				allowNull: true
			},
		})
	},

	async down(queryInterface, Sequelize) {

	}
};