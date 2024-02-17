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
			water_body_id: {
				type: Sequelize.DataTypes.BIGINT,
				allowNull: false,
				defaultValue: 0
			},
			inspection_date: {
				type: Sequelize.DataTypes.DATE,
				allowNull: true
			},
			participants_ids: {
				type: Sequelize.DataTypes.DATE,
				allowNull: true
			},
			summary: {
				type: Sequelize.DataTypes.STRING(4096),
				allowNull: true
			}
		})
	},

	async down(queryInterface, Sequelize) {

	}
};