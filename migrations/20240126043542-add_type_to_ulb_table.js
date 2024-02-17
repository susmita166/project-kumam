'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.addColumn('m_urban_local_bodies', 'type_id', {
			type: Sequelize.DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0,
			after: 'status'
		})
	},

	async down(queryInterface, Sequelize) {
		/**
		 * Add reverting commands here.
		 *
		 * Example:
		 * await queryInterface.dropTable('users');
		 */
	}
};