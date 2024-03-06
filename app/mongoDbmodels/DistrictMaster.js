const { default: mongoose } = require('mongoose');
const mongoDbConnection = require("../../util/mongoDbmodels/mongodb");
const logger = require('../../util/logger');
const getExpressValidator = require("../../middlewares/expressValidator");
const { error } = require('winston');

function getDistrictCode(Dist_Id) {
    return new Promise((resolve, reject) => {
        districtDetails.findOne({
            Dist_Id: Dist_Id,
            status: { $ne: 1 }
        }, '-_id -CreatedBy -CreatedOn -State_Id -Is_delete') 
        .then(getData => {
            resolve(getData);
        })
        .catch(error => {
            reject(error);
        })
    })
}



const districtMasterSchema = new mongoDbConnection.Schema({
    Dist_Id : {
        type:Number,
        required:true,
        unique:true
    },
    State_Id : {
        type:Number,
        required:true
    },
    Dist_Name :{
        type:String,
        require:true
    },
    Dist_Code :{
        type:String,
        require:true
    },
    Status : {
        type: Number,
        enum: [1, 2]
    },
    Is_delete : {
        type : Number,
    },  
    CreatedBy : {
        type : Number,
    },
    CreatedOn : {
        type: Date, 
        default: Date.now
    },
}, { collection: 'tblDistrictMaster'})

const districtDetails = mongoose.model("districtDetails", districtMasterSchema);

module.exports = {
    getDistrictCode
};