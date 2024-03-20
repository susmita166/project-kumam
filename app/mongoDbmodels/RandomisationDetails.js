const { default: mongoose } = require('mongoose');
const mongoDbConnection = require("../../util/mongoDbmodels//mongodb");
const logger = require('../../util/logger');
const getExpressValidator = require("../../middlewares/expressValidator");
const { error } = require('winston');

async function getErandomisation(filterData, limit, skip) {
    try {
        const getData = await tblERandAllcnSummary.find(filterData).skip(skip).limit(limit);
        // console.log(getData);
        return getData;
    } catch (error) {
        throw error;
    }
}

async function deleteBasedOnSpacifiicData(SpecificId) {
    try {
        const getData = await tblERandAllcnSummary.deleteMany(SpecificId);
        console.log(getData);
        return getData;
    } catch (error) {
        throw error;
    }
}


const RandomisationDetailsSchema = new mongoDbConnection.Schema({
    id:{
        type : Number,
        required :true,
        unique:true
    },
    orderNo :{
        type : Number,
        required :true
    },
    RuleID  :{
        type : Number,
        required :true
    },
    ApplcntID :{
        type : Number,
        required :true
    },
    ApplcntType :{
        type : String,
        enum: ["P", "S", "A"]
    },
    ApplicationID :{
        type : Number,
        required :true
    },
    SchemeID :{
        type : Number,
        required :true
    },
    TripGroupID : {
        type : Number,
        required :true
    },
    TripID  : {
        type : Number,
        required :true
    },
    DistID  : {
        type : Number,
        required: true
    },
    BlockId   : {
        type : Number,
        required: true
    },
    Status :{
        type : String,
        enum: ["C", "W", "R", "V"]
    },
    Remark :{
        type : String,
    },
    isTatkal: {
        enum: [0, 1]
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
}, { collection: 'tblERandAllcnSummary' });

const tblERandAllcnSummary = mongoose.model("tblERandAllcnSummary", RandomisationDetailsSchema);

// To check the Schema is associated with the table or not
const isAssociated = mongoose.connection.modelNames().includes('tblERandAllcnSummary');

// if (isAssociated) {
//     console.log(isAssociated,'The schema is associated with a collection.');
// } else {
//     console.log('The schema is not associated with any collection.');
// }


module.exports = {
    getErandomisation,
    deleteBasedOnSpacifiicData
};