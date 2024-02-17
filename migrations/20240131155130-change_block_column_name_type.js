'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.changeColumn('m_blocks', 'name', {
			type: Sequelize.STRING(255),
		});
	},

	async down(queryInterface, Sequelize) {

	}
};