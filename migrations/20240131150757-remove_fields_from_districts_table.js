'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await Promise.all([
			queryInterface.removeColumn('m_districts', 'short_code'),
			queryInterface.removeColumn('m_districts', 'lgd_code'),
			queryInterface.removeColumn('m_districts', 'numeric_sheet_code'),
		]);
	},

	async down(queryInterface, Sequelize) {

	}
};