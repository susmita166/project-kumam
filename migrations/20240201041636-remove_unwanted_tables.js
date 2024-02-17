'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await Promise.all([
			queryInterface.dropTable('m_gram_panchayats'),
			queryInterface.dropTable('m_sectors'),
			queryInterface.dropTable('m_state_executing_bodies'),
			queryInterface.dropTable('m_villages'),
		]);
	},

	async down(queryInterface, Sequelize) {

	}
};