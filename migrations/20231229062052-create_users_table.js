'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('t_users', {
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
			role_id: {
				type: Sequelize.DataTypes.INTEGER(),
				allowNull: false,
				defaultValue: 0
			},
			first_name: {
				type: Sequelize.DataTypes.STRING(255),
				allowNull: false,
			},
			last_name: {
				type: Sequelize.DataTypes.STRING(255),
				allowNull: false,
			},
			email: {
				type: Sequelize.DataTypes.STRING(255),
				allowNull: false
			},
			username: {
				type: Sequelize.DataTypes.STRING(255),
				allowNull: false
			},
			password: {
				type: Sequelize.DataTypes.STRING(2048),
				allowNull: false,
			}
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