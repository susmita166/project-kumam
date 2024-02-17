'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('t_msgs', {
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
			ulb_id: {
				type: Sequelize.DataTypes.BIGINT.UNSIGNED,
				allowNull: false,
				defaultValue: 0
			},
			block_id: {
				type: Sequelize.DataTypes.BIGINT.UNSIGNED,
				allowNull: false,
				defaultValue: 0
			},
			name: {
				type: Sequelize.DataTypes.STRING(255),
				allowNull: false
			},
			p_name: {
				type: Sequelize.DataTypes.STRING(255),
				allowNull: false
			},
			p_father_name: {
				type: Sequelize.DataTypes.STRING(255),
				allowNull: true
			},
			p_aadhaar_number: {
				type: Sequelize.DataTypes.STRING(255),
				allowNull: true
			},
			p_aadhaar_file_name: {
				type: Sequelize.DataTypes.STRING(255),
				allowNull: true,
				defaultValue: null
			},
			p_mobile: {
				type: Sequelize.DataTypes.STRING(255),
				allowNull: true,
				defaultValue: null
			},
			p_email: {
				type: Sequelize.DataTypes.STRING(255),
				allowNull: true,
				defaultValue: null
			},
			s_name: {
				type: Sequelize.DataTypes.STRING(255),
				allowNull: false
			},
			s_father_name: {
				type: Sequelize.DataTypes.STRING(255),
				allowNull: true
			},
			s_aadhaar_number: {
				type: Sequelize.DataTypes.STRING(255),
				allowNull: true
			},
			s_aadhaar_file_name: {
				type: Sequelize.DataTypes.STRING(255),
				allowNull: true,
				defaultValue: null
			},
			s_mobile: {
				type: Sequelize.DataTypes.STRING(255),
				allowNull: true,
				defaultValue: null
			},
			s_email: {
				type: Sequelize.DataTypes.STRING(255),
				allowNull: true,
				defaultValue: null
			}
		});
	},

	async down(queryInterface, Sequelize) {

	}
};