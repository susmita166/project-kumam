'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('m_villages', {
			id: {
				type: Sequelize.DataTypes.BIGINT.UNSIGNED,
				allowNull: false,
				autoIncrement: true,
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
			gram_panchayat_id: {
				type: Sequelize.INTEGER
			},
			name: {
				type: Sequelize.STRING
			},
			remarks: {
				type: Sequelize.STRING
			}
		});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('m_villages');
	}
};