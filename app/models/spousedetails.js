const {
	Model,
	DataTypes,
	Op
} = require('sequelize');
const sequelize = require("../../util/database");
const logger = require('../../util/logger');
const moment = require('moment');



class SpouseDetails extends Model {
    static STATUS_ACTIVE = 0;
    static STATUS_DELETED = 1;
    static async getSpouseDetails(limit, skip){
        try {
          return await SpouseDetails.findAll({
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

SpouseDetails.init({
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    ApplicationId: DataTypes.INTEGER,
    Spouce_Name: DataTypes.STRING,
    Photo: DataTypes.STRING,
    DOB: DataTypes.STRING,
    DOB_In_Year: DataTypes.INTEGER,
    Blood_Group: DataTypes.STRING,
    Gender: DataTypes.STRING,
    Aadhar_No: DataTypes.STRING,
    marriage_proof_doc: DataTypes.STRING,
    Do_You_Wish_To_Avail_Attendant : DataTypes.STRING,
    IsDeletd: DataTypes.INTEGER,
    CreatedBy: DataTypes.INTEGER,
    CreatedOn: DataTypes.DATE,
    ModifiedBy: DataTypes.STRING,
    ModifiedOn: DataTypes.DATE
  }, {
    sequelize,
    modelName: 't_spoucedetails',
    timestamps: false
});

module.exports = SpouseDetails;