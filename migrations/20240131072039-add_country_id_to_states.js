'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		const tableName = 'm_states';
		await queryInterface.addColumn(tableName, 'country_id', {
			type: Sequelize.DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0
		});
	},

	async down(queryInterface, Sequelize) {

	}
};