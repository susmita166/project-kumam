'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('m_vendors', {
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
			name: {
				type: Sequelize.DataTypes.STRING(255),
				allowNull: false
			},
			gst_number: {
				type: Sequelize.DataTypes.STRING(255),
				allowNull: true,
				defaultValue: null
			},
			gst_certificate_file_name: {
				type: Sequelize.DataTypes.STRING(255),
				allowNull: true,
				defaultValue: null
			},
			mobile: {
				type: Sequelize.DataTypes.STRING(255),
				allowNull: true,
				defaultValue: null
			},
			email: {
				type: Sequelize.DataTypes.STRING(255),
				allowNull: true,
				defaultValue: null
			},
			district_id: {
				type: Sequelize.DataTypes.INTEGER,
				allowNull: false,
				defaultValue: 0
			},
			police_station: {
				type: Sequelize.DataTypes.STRING(255),
				allowNull: true,
				defaultValue: null
			},
			village: {
				type: Sequelize.DataTypes.STRING(255),
				allowNull: true,
				defaultValue: null
			},
			locality: {
				type: Sequelize.DataTypes.STRING(255),
				allowNull: true,
				defaultValue: null
			},
			street_address: {
				type: Sequelize.DataTypes.STRING(255),
				allowNull: true,
				defaultValue: null
			},
			pincode: {
				type: Sequelize.DataTypes.STRING(255),
				allowNull: true,
				defaultValue: null
			},
			cp_name: {
				type: Sequelize.DataTypes.STRING(255),
				allowNull: true,
				defaultValue: null
			},
			cp_designation: {
				type: Sequelize.DataTypes.STRING(255),
				allowNull: true,
				defaultValue: null
			},
			cp_aadhaar_number: {
				type: Sequelize.DataTypes.STRING(255),
				allowNull: true,
				defaultValue: null
			},
			cp_aadhaar_file_name: {
				type: Sequelize.DataTypes.STRING(255),
				allowNull: true,
				defaultValue: null
			},
			cp_mobile: {
				type: Sequelize.DataTypes.STRING(255),
				allowNull: true,
				defaultValue: null
			},
			cp_email: {
				type: Sequelize.DataTypes.STRING(255),
				allowNull: true,
				defaultValue: null
			}
		});
	},

	async down(queryInterface, Sequelize) {

	}
};