const { default: mongoose } = require('mongoose');
const mongoDbConnection = require("../../util/mongoDbmodels/mongodb");
const logger = require('../../util/logger');
const getExpressValidator = require("../../middlewares/expressValidator");

async function getLastRecord(){
    let getLastRecord = await AttendantDetails.find().sort({id:-1}).limit(1) ;
    return getLastRecord;
}

function insertAttendantDetails(attendantData){
    return new Promise((resolve, reject)=>{
        AttendantDetails.create(attendantData)
        .then(saveData =>{
            resolve (saveData);
        })
        .catch(error =>{
            reject (error);
        })
    });
}

function updateData(ApplicationId, attendantData){
      return new Promise((resolve, reject)=>{
         AttendantDetails.findOneAndUpdate({ApplicationId: ApplicationId})
         .then(updateDt =>{
            resolve (updateData);
         })
         .catch(error =>{
            reject (error);
         })
      })
}

function getAttendantDt(ApplicationId){
    return new Promise((resolve, reject)=>{
        AttendantDetails.find({ApplicationId: ApplicationId})
        .then(getData =>{
            resolve (getData);
        })
        .catch(error =>{
            reject (error);
        })
    })
}

const AttendantDetailsSchema = new mongoDbConnection.Schema({
    id:{
        type : Number,
        required :true,
        unique:true
    },
    ApplicationId  :{
        type : Number,
        required :true
    },
    Attendant_Name: {
        type : String,
        required :true
    },
    DOB: {
        type : String,
        required :true
    },
    Aadhar_No: {
        type : String,
        required :true
    },
    Photo: [{ type: Object }],
    IsDeletd: {
        type : Number,
    },  
    CreatedBy: {
        type : Number,
    },
    CreatedOn : {
        type: Date, 
        default: Date.now
    },
    ModifiedBy: {
        type : String,
    },
    ModifiedOn : {
        type: Date, 
        default: Date.now
    },
}, { collection: 'AttendantDetails' });


const AttendantDetails = mongoose.model("AttendantDetails", AttendantDetailsSchema);

module.exports = {
    getLastRecord,
    insertAttendantDetails,
    getAttendantDt,
    updateData
};