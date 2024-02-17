'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('t_water_body_parameters', {
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
			water_body_id: {
				type: Sequelize.DataTypes.BIGINT,
				allowNull: false,
				defaultValue: 0
			},
			bod: {
				type: Sequelize.DataTypes.DECIMAL(12,2),
				allowNull: false,
				defaultValue: 0,
				comment: 'Biochemical Oxygen Demand'
			},
			cod: {
				type: Sequelize.DataTypes.DECIMAL(12,2),
				allowNull: false,
				defaultValue: 0,
				comment: 'Chemical Oxygen Demand'
			},
			do: {
				type: Sequelize.DataTypes.DECIMAL(12,2),
				allowNull: false,
				defaultValue: 0,
				comment: 'Dissolved Oxygen'
			},
			tds: {
				type: Sequelize.DataTypes.DECIMAL(12,2),
				allowNull: false,
				defaultValue: 0,
				comment: 'Total Dissolved Solids'
			},
			turbidity: {
				type: Sequelize.DataTypes.DECIMAL(12,2),
				allowNull: false,
				defaultValue: 0,
				comment: 'Water Clarity'
			},
		});
	},

	async down(queryInterface, Sequelize) {

	}
};