/** @type {import('sequelize-cli').Migration} */

module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('m_urban_local_bodies', {
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
				type: Sequelize.STRING
			},
			district_id: {
				type: Sequelize.INTEGER
			},
			population: {
				type: Sequelize.INTEGER
			},
			area_acres: {
				type: Sequelize.DECIMAL
			},
			mayor: {
				type: Sequelize.STRING
			},
			deputy_mayor: {
				type: Sequelize.STRING
			},
		});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('m_urban_local_bodies');
	}
};