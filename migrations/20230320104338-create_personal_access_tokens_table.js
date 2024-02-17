'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('t_personal_access_tokens', {
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
				comment: "0 (Archived), 1 (Active), 2 (Inactive)",
				allowNull: false,
				defaultValue: "1"
			},
			user_id: {
				type: Sequelize.DataTypes.BIGINT.UNSIGNED,
				allowNull: false,
			},
			token: {
				type: Sequelize.DataTypes.STRING(4096),
				allowNull: false,
			},
			last_used_at: {
				type: Sequelize.DataTypes.DATE,
				allowNull: true,
			},
			expires_at: {
				type: Sequelize.DataTypes.DATE,
				allowNull: true,
			},
			client_browser_name: {
				type: Sequelize.DataTypes.STRING(255),
				allowNull: true
			},
			client_browser_version: {
				type: Sequelize.DataTypes.STRING(255),
				allowNull: true
			},
			client_platform: {
				type: Sequelize.DataTypes.STRING(255),
				allowNull: true
			}
		}, {
			engine: process.env.DB_ENGINE,
			charset: process.env.DB_CHARSET,
			collate: process.env.DB_COLLATE,
			rowFormat: process.env.DB_ROW_FORMAT
		});
	},

	async down(queryInterface, Sequelize) {}
};