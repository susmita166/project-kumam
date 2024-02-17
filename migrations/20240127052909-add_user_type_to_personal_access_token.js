'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.addColumn('t_personal_access_tokens', 'user_type', {
			type: Sequelize.DataTypes.ENUM(['1', '2', '3', '4', '5']),
			allowNull: false,
			defaultValue: "1",
			comment: '1 (Super Admin), 2 (HUD), 3 (WRU), 4 (SUDA), 5 (ULB)',
			after: 'status'
		});
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