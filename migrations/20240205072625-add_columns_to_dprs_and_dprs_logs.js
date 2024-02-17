'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		Promise.all([
			queryInterface.addColumn('t_water_body_dprs_logs', 'expenditure_amount', {
				type: Sequelize.DataTypes.DECIMAL(20, 2),
				allowNull: false,
				defaultValue: 0,
				comment: 'In Lakhs'
			}),
			queryInterface.addColumn('t_water_body_dprs', 'expenditure_amount', {
				type: Sequelize.DataTypes.DECIMAL(20, 2),
				allowNull: false,
				defaultValue: 0,
				comment: 'In Lakhs'
			}),
		]);
	},

	async down(queryInterface, Sequelize) {

	}
};