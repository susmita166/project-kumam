'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('AttendantDetails', {
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
      Attendant_Name: {
        type: Sequelize.STRING
      },
      Attn_Father_Nm: {
        type: Sequelize.STRING
      },
      Gender: {
        type: Sequelize.STRING
      },
      Photo: {
        type: Sequelize.STRING
      },
      DOB: {
        type: Sequelize.STRING
      },
      DOB_In_Year: {
        type: Sequelize.INTEGER
      },
      Blood_Group: {
        type: Sequelize.STRING
      },
      Aadhar_No: {
        type: Sequelize.STRING
      },
      BankName: {
        type: Sequelize.STRING
      },
      Draft_No: {
        type: Sequelize.STRING
      },
      Draft_date: {
        type: Sequelize.DATE
      },
      draftPhoto: {
        type: Sequelize.TEXT
      },
      MobileNo: {
        type: Sequelize.STRING
      },
      IsDeletd: {
        type: Sequelize.INTEGER
      },
      CreatedBy: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        type: Sequelize.DATE
      },
      ModifiedBy: {
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('AttendantDetails');
  }
};