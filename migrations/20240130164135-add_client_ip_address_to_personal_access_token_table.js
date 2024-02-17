'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.addColumn('t_personal_access_tokens', 'client_ip_address', {
			type: Sequelize.DataTypes.STRING(255),
			allowNull: true
		})
	},

	async down(queryInterface, Sequelize) {

	}
};