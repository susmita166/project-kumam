const {
	Model,
	DataTypes,
	Op
} = require('sequelize');
const sequelize = require("../../util/database");
const logger = require('../../util/logger');
const moment = require('moment');

class AttendantDetails extends Model {
    static STATUS_ACTIVE = 0;
    static STATUS_DELETED = 1;

    static async getAttendantDetails(limit, skip){
      try {
        return await AttendantDetails.findAll({
          attributes: {
            exclude: ['CreatedBy', 'ModifiedBy', 'CreatedOn', 'ModifiedOn', 'IsDeletd']
          },
          IsDeletd : {
            [Op.ne]: this.STATUS_DELETED
          },
          limit: limit,
          offset: skip 
        });
      } catch (error) {
        logger.error(error);
        return [];
      }
  }
}

AttendantDetails.init({
  id:{
    type : Number,
    required :true,
    primaryKey:true
  },
  ApplicationId: DataTypes.INTEGER,
  Attendant_Name: DataTypes.STRING,
  Attn_Father_Nm: DataTypes.STRING,
  Gender: DataTypes.STRING,
  Photo: DataTypes.STRING,
  DOB: DataTypes.STRING,
  DOB_In_Year: DataTypes.INTEGER,
  Blood_Group: DataTypes.STRING,
  Aadhar_No: DataTypes.STRING,
  BankName: DataTypes.STRING,
  Draft_No: DataTypes.STRING,
  Draft_date: DataTypes.DATE,
  Draft_Amount: DataTypes.DECIMAL(10,0), 
  draftPhoto: DataTypes.TEXT,
  MobileNo: DataTypes.STRING,
  IsDeletd: DataTypes.INTEGER,
  CreatedBy: DataTypes.INTEGER,
  CreatedOn: DataTypes.DATE,
  ModifiedBy: DataTypes.STRING,
  ModifiedOn: DataTypes.DATE
  }, {
    sequelize,
    modelName: 't_attendantdetails',
    timestamps: false
});

module.exports = AttendantDetails;