const { default: mongoose } = require('mongoose');
const mongoDbConnection = require("../../util/mongoDbmodels/mongodb");
const logger = require('../../util/logger');
const getExpressValidator = require("../../middlewares/expressValidator");
const { error } = require('winston');



async function getLastRecord(){
    let getLastRecord = await PersonalDetails.find().sort({id:-1}).limit(1) ;
    return getLastRecord;
}

function getPrsnlDt(ApplicationId){
    return new Promise((resolve, reject)=>{
        PersonalDetails.findOne({id: ApplicationId})
        .then(getData =>{
            resolve (getData);
        })
        .catch(error =>{
            reject (error);
        })
    })
}

function getAllPersnlDt(limit, skip){
    return new Promise((resolve,reject) =>{
        PersonalDetails.find().skip(skip).limit(limit)
        .then(getData =>{
            resolve (getData);
        })
        .catch(error=>{
            reject (error);
        })
    })
}

function updateData(ApplicationId, PersonalDetailsData){
    return new Promise((resolve, reject)=>{
        PersonalDetails.findOneAndUpdate({id:ApplicationId}, PersonalDetailsData, { new: true, runValidators: true })
        .then(updateDt =>{
            resolve (updateDt);
        })
        .catch(error =>{
            reject (error);
        })
    })
}


function deletePersnlDt(ApplicationId){
    return new Promise((resolve, reject)=>{
        PersonalDetails.deleteOne({id:ApplicationId})
        .then(deleteData =>{
            resolve (deleteData);
        })
        .catch(error =>{
            reject (error);
        })
    })
}

function insertPersonalDetails(PersonalDetailsData){
    return new Promise((resolve, reject)=>{
        PersonalDetails.create(PersonalDetailsData)
        .then(saveData =>{
            resolve (saveData);
        })
        .catch(error =>{
            reject (error);
        })
    });
}


const PersonalDetailsSchema = new mongoDbConnection.Schema({
    id:{
        type : Number,
        required :true,
        unique:true
    },
    Scheme_Id :{
        type : Number,
        required :true
    },
    TripGroupID  : {
        type : Number,
        required :true
    },
    Domicile_DistId : {
        type : String,
        required :Number
    },
    RegistrationNo : {
        type : String,
    },
    Applicant_Name: {
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
    Photo: String,
    Identity_Proof_Document: String,
    Mobile_No: {
        type : String,
        required :true
    },
    Email_Id: {
        type : String
    },
    Do_You_Wish_To_Avail_Attendant: {
        type : Number
    },
    User_Id: {
        type : Number,
        required :true
    }, 
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
}, { collection: 'PersonalDetails' });

const PersonalDetails = mongoose.model("PersonalDetails", PersonalDetailsSchema);

module.exports = {
    getLastRecord,
    insertPersonalDetails,
    getPrsnlDt,
    updateData,
    getAllPersnlDt,
    deletePersnlDt
};