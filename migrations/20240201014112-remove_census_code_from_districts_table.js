'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.removeColumn('m_districts', 'census_code');
	},

	async down(queryInterface, Sequelize) {

	}
};