'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('m_state_executing_bodies', {
			id: {
				type: Sequelize.DataTypes.BIGINT.UNSIGNED,
				autoIncrement: true,
				allowNull: false,
				primaryKey: true,
			},
			created_by: {
				type: Sequelize.DataTypes.BIGINT.UNSIGNED,
				allowNull: false,
				defaultValue: 0
			},
			created_at: {
				type: Sequelize.DataTypes.DATE,
				allowNull: false,
			},
			updated_by: {
				type: Sequelize.DataTypes.BIGINT.UNSIGNED,
				allowNull: false,
				defaultValue: 0
			},
			updated_at: {
				type: Sequelize.DataTypes.DATE,
				allowNull: false,
			},
			status: {
				type: Sequelize.DataTypes.ENUM(['0', '1', '2']),
				comment: "0 (Deleted), 1 (Active), 2 (Inactive)",
				allowNull: false,
				defaultValue: "1"
			},
			state_id: {
				type: Sequelize.INTEGER
			},
			department_id: {
				type: Sequelize.INTEGER
			},
			name: {
				type: Sequelize.STRING
			},
			description: {
				type: Sequelize.STRING
			}
		});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('m_state_executing_bodies');
	}
};