const {
	Model,
	DataTypes,
	Op
} = require('sequelize');
const sequelize = require("../../util/database");
const logger = require('../../util/logger');
const moment = require('moment');

class PersonalDetail extends Model {
  static STATUS_ACTIVE = 0;
	static STATUS_DELETED = 1;

  static async getPersonalDetails(filterData, limit, skip){
      try {
        return await PersonalDetail.findAll({
          attributes: {
            exclude: ['CreatedBy', 'ModifiedBy', 'CreatedOn', 'ModifiedOn']
          },
          where: filterData,
          limit: limit,
          offset: skip 
        });
      } catch (error) {
        logger.error(error);
        return [];
      }
  }

  static async getPersonalDetailsWithoutFilterData(filterData, limit, skip) {
    try {
      const personalDetails = await PersonalDetail.findAll({
        where : filterData,
        attributes: ['id',  'Applicant_Type', 'Applicant_Name', 'Gender', 'DOB', 'Email_Id', 'Mobile_No', 'RegistrationNo', 'Aadhar_No', 'Domicile_DistId'],
        limit: limit,
        offset: skip,
        raw: true 
      });
      return personalDetails;
    } catch (error) {
      console.error('Error fetching personal details:', error);
      return [];
    }
  }
  
}


PersonalDetail.init({
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    Scheme_Id: DataTypes.INTEGER,
    TripGroupID: DataTypes.INTEGER,
    Domicile_DistId: DataTypes.INTEGER,
    RegistrationNo: DataTypes.STRING,
    Applicant_Type: DataTypes.STRING,
    Applicant_Name: DataTypes.STRING,
    Father_Name: DataTypes.STRING,
    Gender: DataTypes.STRING,
    DOB: DataTypes.STRING,
    DOB_In_Year: DataTypes.INTEGER,
    Blood_Group: DataTypes.STRING,
    Aadhar_No: DataTypes.STRING,
    Family_Category: DataTypes.STRING,
    Family_Category_Proof_Type: DataTypes.STRING,
    Photo: DataTypes.STRING,
    Family_Category_Proof_Type: DataTypes.STRING,
    Family_Category_Proof_Document: DataTypes.STRING,
    Identity_Proof_type: DataTypes.STRING,
    Identity_Proof_Document: DataTypes.STRING,
    Mobile_No: DataTypes.STRING,
    Alternate_Mobile_No: DataTypes.STRING,
    Email_Id: DataTypes.STRING,
    Do_You_Wish_To_Avail_Attendant: DataTypes.INTEGER,
    User_Id: DataTypes.INTEGER,
    wildcard_application: DataTypes.TINYINT,
    Application_Status :{
      type : String,
      enum: [0, 1, 2, 4]
    },
    submit_type: DataTypes.TINYINT,
    Action: DataTypes.STRING,
    Remark: DataTypes.STRING,
    IsDeletd: DataTypes.INTEGER,
    CreatedBy: DataTypes.INTEGER,
    CreatedOn: DataTypes.DATE,
    ModifiedBy: DataTypes.STRING,
    ModifiedOn: DataTypes.DATE
  }, {
    sequelize,
    modelName: 't_tblpersonaldetails',
    timestamps: false
});
module.exports = PersonalDetail;
