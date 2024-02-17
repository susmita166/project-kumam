'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		const tableName = 'm_schemes';
		await queryInterface.addColumn(tableName, 'effective_start_date', {
			type: Sequelize.DataTypes.DATE,
			allowNull: true,
		});
		await queryInterface.addColumn(tableName, 'effective_end_date', {
			type: Sequelize.DataTypes.DATE,
			allowNull: true,
		});
	},

	async down(queryInterface, Sequelize) {

	}
};