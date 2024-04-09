const { default: mongoose } = require('mongoose');
const mongoDbConnection = require("../../util/mongoDbmodels/mongodb");
// const PersonalDetailsModel = require("../mongoDbmodels/PersonalDetails");
// const SpouseDetailsModel = require("../mongoDbmodels/SpouseDetails");
// const AttendantDetailsModel = require("../mongoDbmodels/AttendantDetails");
const logger = require('../../util/logger');
const getExpressValidator = require("../../middlewares/expressValidator");





const ApplicantVerificationSchema = new mongoDbConnection.Schema({
    Applicant_Name:{
        type : String,
    },
    TripGroupID:{
        type : Number,
    },
    Gender :{
        type : String,
    },
    Applicant_Type :{
        type : String,
        enum: ["P", "S", "A"]
    },
    ApplicationID  :{
        type : Number,
        required :true
    },
    SpouseDetailsId :{
        type : Number,
        required :true
    },
    Spouce_Name  : {
        type : String,
    },
    Domicile_DistId  : {
        type : Number,
        required: true
    },
    RegistrationNo  : {
        type : String,
    },
    AttendantDetailsId :{
        type : Number,
        required :true
    },
    Attendant_Name  : {
        type : String,
    },  
}, { collection: 'ApplicntVerificationDetails'});

const ApplicntVerificationDetails = mongoose.model("ApplicntVerificationDetails", ApplicantVerificationSchema);

// module.exports = {
//     getVerificationDetails,
//     getVerificationDetailsBasedOnSpecificCondition
// };