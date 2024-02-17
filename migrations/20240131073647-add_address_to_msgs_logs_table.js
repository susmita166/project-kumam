'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		const tableName = 't_msgs_logs';
		const tableDescription = await queryInterface.describeTable(tableName);
		if ('block_id' in tableDescription) {
			await queryInterface.removeColumn(tableName, 'block_id');
		}
		await Promise.all([
			queryInterface.addColumn(tableName, 'pan_number', {
				type: Sequelize.DataTypes.STRING(255),
				allowNull: true,
				defaultValue: null,
				after: "name"
			}),
			queryInterface.addColumn(tableName, 'pan_file_name', {
				type: Sequelize.DataTypes.STRING(255),
				allowNull: true,
				defaultValue: null,
				after: "pan_number",
			}),
			queryInterface.addColumn(tableName, 'block_id', {
				type: Sequelize.DataTypes.INTEGER,
				allowNull: false,
				defaultValue: 0,
				after: "pan_file_name"
			}),
			queryInterface.addColumn(tableName, 'village_name', {
				type: Sequelize.DataTypes.STRING(255),
				allowNull: true,
				defaultValue: null,
				after: "block_id"
			}),
			queryInterface.addColumn(tableName, 'locality_name', {
				type: Sequelize.DataTypes.STRING(255),
				allowNull: true,
				defaultValue: null,
				after: "village_name"
			}),
			queryInterface.addColumn(tableName, 'street_address', {
				type: Sequelize.DataTypes.STRING(255),
				allowNull: true,
				defaultValue: null,
				after: "locality_name"
			}),
			queryInterface.addColumn(tableName, 'pincode', {
				type: Sequelize.DataTypes.STRING(255),
				allowNull: true,
				defaultValue: null,
				after: "street_address"
			}),
		]);
	},

	async down(queryInterface, Sequelize) {

	}
};