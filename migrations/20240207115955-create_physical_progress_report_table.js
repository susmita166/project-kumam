'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		queryInterface.createTable('t_physical_progress_reports', {
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
			physical_progress_id: {
				type: Sequelize.DataTypes.BIGINT,
				allowNull: false,
				defaultValue: 0
			},
			dewatering: {
				type: Sequelize.DataTypes.DECIMAL(10,2),
				allowNull: false,
				defaultValue: 0,
				comment: 'Milestone 1'
			},
			deweeding: {
				type: Sequelize.DataTypes.DECIMAL(10,2),
				allowNull: false,
				defaultValue: 0,
				comment: 'Milestone 2'
			},
			desilting: {
				type: Sequelize.DataTypes.DECIMAL(10,2),
				allowNull: false,
				defaultValue: 0,
				comment: 'Milestone 3'
			},
			bund_strengthening: {
				type: Sequelize.DataTypes.DECIMAL(10,2),
				allowNull: false,
				defaultValue: 0,
				comment: 'Milestone 4'
			},
			biomining: {
				type: Sequelize.DataTypes.DECIMAL(10,2),
				allowNull: false,
				defaultValue: 0,
				comment: 'Milestone 5'
			},
			filtration: {
				type: Sequelize.DataTypes.DECIMAL(10,2),
				allowNull: false,
				defaultValue: 0,
				comment: 'Milestone 6'
			},
			reconditioning: {
				type: Sequelize.DataTypes.DECIMAL(10,2),
				allowNull: false,
				defaultValue: 0,
				comment: 'Milestone 7'
			},
			pathway: {
				type: Sequelize.DataTypes.DECIMAL(10,2),
				allowNull: false,
				defaultValue: 0,
				comment: 'Milestone 8'
			},
			plantation: {
				type: Sequelize.DataTypes.DECIMAL(10,2),
				allowNull: false,
				defaultValue: 0,
				comment: 'Milestone 9'
			},
			physical_progress: {
				type: Sequelize.DataTypes.DECIMAL(20,2),
				allowNull: false,
				defaultValue: 0,
				comment: 'Milestones Count / 100'
			},
			photos: {
				type: Sequelize.DataTypes.JSON,
				allowNull: true,
			}
		})
	},

	async down(queryInterface, Sequelize) {

	}
};