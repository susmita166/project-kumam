'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('YourModels', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id: {
        type: Sequelize.INTEGER
      },
      ApplicationId: {
        type: Sequelize.INTEGER
      },
      Spouce_Name: {
        type: Sequelize.STRING
      },
      DOB: {
        type: Sequelize.STRING
      },
      Aadhar_No: {
        type: Sequelize.STRING
      },
      marriage_proof_doc: {
        type: Sequelize.STRING
      },
      Photo: {
        type: Sequelize.STRING
      },
      IsDeletd: {
        type: Sequelize.INTEGER
      },
      CreatedBy: {
        type: Sequelize.INTEGER
      },
      CreatedOn: {
        type: Sequelize.DATE
      },
      ModifiedBy: {
        type: Sequelize.STRING
      },
      ModifiedOn: {
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('YourModels');
  }
};