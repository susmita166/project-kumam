'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('t_tulip_interns', {
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
			name: {
				type: Sequelize.DataTypes.STRING(255),
				allowNull: false
			},
			father_name: {
				type: Sequelize.DataTypes.STRING(255),
				allowNull: true
			},
			aadhaar_number: {
				type: Sequelize.DataTypes.STRING(255),
				allowNull: true
			},
			aadhaar_file_name: {
				type: Sequelize.DataTypes.STRING(255),
				allowNull: true,
				defaultValue: null
			},
			block_id: {
				type: Sequelize.DataTypes.INTEGER,
				allowNull: false,
				defaultValue: 0
			},
			village_name: {
				type: Sequelize.DataTypes.STRING(255),
				allowNull: true,
				defaultValue: null
			},
			locality_name: {
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
			reporting_date: {
				type: Sequelize.DataTypes.DATE,
				allowNull: true,
				defaultValue: null
			},
			tenure_completion_date: {
				type: Sequelize.DataTypes.DATE,
				allowNull: true,
				defaultValue: null
			},
			offer_letter_file_name: {
				type: Sequelize.DataTypes.STRING(255),
				allowNull: true,
				defaultValue: null
			},
		});
	},

	async down(queryInterface, Sequelize) {

	}
};