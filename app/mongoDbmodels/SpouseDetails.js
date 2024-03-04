const { default: mongoose } = require('mongoose');
const mongoDbConnection = require("../../util/mongoDbmodels/mongodb");
const logger = require('../../util/logger');
const getExpressValidator = require("../../middlewares/expressValidator");

async function getLastRecord(){
    let getLastRecord = await SpouseDetails.find().sort({id:-1}).limit(1) ;
    return getLastRecord;
}

function insertSpouseDEtails(sposeData){
    return new Promise((resolve, reject)=>{
        SpouseDetails.create(sposeData)
        .then(saveData =>{
            resolve (saveData);
        })
        .catch(error =>{
            reject (error);
        })
    });
}

function getSpouseDt(ApplicationId){
    return new Promise((resolve, reject)=>{
        SpouseDetails.findOne({ApplicationId: ApplicationId})
        .then(getData =>{
            resolve (getData);
        })
        .catch(error =>{
            reject (error);
        })
        
    })
}


function updateData(ApplicationId, sposeData){
    return new Promise((resolve, reject)=>{
        SpouseDetails.findOneAndUpdate({ApplicationId: ApplicationId}, sposeData,  {new: true, runValidators: true })
        .then(updateData =>{
            resolve (updateData);
        })
        .catch(error =>{
            reject (error);
        })
    })
}


function getDataBasedOnApplicationIds(ApplicationIds){
    return new Promise((resolve, reject)=>{
        SpouseDetails.find().where('ApplicationId').in(ApplicationIds)
        .then(getData =>{
            resolve (getData);
        })
        .catch(error =>{
            reject (error);
        })
    })
}



const SposeDetailsSchema = new mongoDbConnection.Schema({
    id:{
        type : Number,
        required :true,
        unique:true
    },
    ApplicationId  :{
        type : Number,
        required :true
    },
    Spouce_Name: {
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
    marriage_proof_doc:String,
    Photo: String,
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
}, { collection: 'SpouseDetails' });

const SpouseDetails = mongoose.model("SpouseDetails", SposeDetailsSchema);

module.exports = {
    getLastRecord,
    insertSpouseDEtails,
    getSpouseDt,
    updateData,
    getDataBasedOnApplicationIds
};