/** @type {import('sequelize-cli').Migration} */

module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('m_blocks', {
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
			district_id: {
				type: Sequelize.BIGINT.UNSIGNED,
				allowNull: false
			},
			name: {
				type: Sequelize.BIGINT.UNSIGNED,
				allowNull: false
			},
			census_code: {
				type: Sequelize.STRING(255),
				allowNull: true
			},
			short_code: {
				type: Sequelize.STRING(255),
				allowNull: true
			},
			lgd_code: {
				type: Sequelize.STRING(255),
				allowNull: true
			},
			numeric_sheet_code: {
				type: Sequelize.BIGINT.UNSIGNED,
				allowNull: true
			}
		});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('m_blocks');
	}
};