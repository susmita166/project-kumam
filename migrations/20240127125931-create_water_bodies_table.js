'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('t_water_bodies', {
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
			scheme_id: {
				type: Sequelize.DataTypes.INTEGER,
				allowNull: false,
				defaultValue: 0
			},
			district_id: {
				type: Sequelize.DataTypes.BIGINT,
				allowNull: false,
				defaultValue: 0
			},
			ulb_id: {
				type: Sequelize.DataTypes.BIGINT,
				allowNull: false,
				defaultValue: 0
			},
			name: {
				type: Sequelize.DataTypes.STRING(255),
				allowNull: false,
			},
			latitude: {
				type: Sequelize.DataTypes.DECIMAL(20,8),
				allowNull: false,
				defaultValue: 0
			},
			longitude: {
				type: Sequelize.DataTypes.DECIMAL(20,8),
				allowNull: false,
				defaultValue: 0
			},
			category_id: {
				type: Sequelize.DataTypes.INTEGER,
				allowNull: false,
				defaultValue: 0
			},
			area_acres: {
				type: Sequelize.DataTypes.DECIMAL(10,2),
				allowNull: false,
				defaultValue: 0
			},
			title_holder_id: {
				type: Sequelize.DataTypes.INTEGER,
				allowNull: false,
				defaultValue: 0
			},
			ror_file_name: {
				type: Sequelize.DataTypes.STRING(255),
				allowNull: true,
				defaultValue: null
			},
			previously_rejuvenated: {
				type: Sequelize.DataTypes.ENUM(['n', 'y']),
				comment: "n (No), y (Yes)",
				allowNull: false,
				defaultValue: "n"
			}
		});
	},

	async down(queryInterface, Sequelize) {

	}
};