'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up (queryInterface, Sequelize) {
		await queryInterface.addColumn('t_water_body_parameters', 'type', {
			type: Sequelize.DataTypes.ENUM(['i', 'c']),
			comment: 'i (Initial), c (Current)',
			allowNull: false,
			defaultValue: 'c',
			after: 'status'
		});
	},

	async down (queryInterface, Sequelize) {

	}
};
