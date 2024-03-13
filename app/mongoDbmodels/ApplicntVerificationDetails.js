const { default: mongoose } = require('mongoose');
const mongoDbConnection = require("../../util/mongoDbmodels/mongodb");
const logger = require('../../util/logger');
const getExpressValidator = require("../../middlewares/expressValidator");


async function getVerificationDetails(limit, skip){
    try {
        return await ApplicntVerificationDetails.find()
                        .select('-_id id ApplcntID ApplcntType ApplicationID SchemeID TripGroupID DistID')
                        .skip(skip)
                        .limit(limit);
    } catch (err) {
        return err;
    }
} 








const ApplicantVerificationSchema = new mongoDbConnection.Schema({
    id:{
        type : Number,
        required :true,
        unique:true
    },
    ApplcntID :{
        type : Number,
        required :true
    },
    ApplcntType :{
        type : String,
        enum: ["P", "S", "A"]
    },
    ApplicationID  :{
        type : Number,
        required :true
    },
    Scheme_Id :{
        type : Number,
        required :true
    },
    TripGroupID  : {
        type : Number,
        required :true
    },
    DistID  : {
        type : Number,
        required: true
    },
    regdNO  : {
        type : String,
    },
    Status : {
        type: String,
        enum: ["A", "R", "V"]
    },
    Remarks : {
        type: String,
    },
}, { collection: 'ApplicntVerificationDetails'});

const ApplicntVerificationDetails = mongoose.model("ApplicntVerificationDetails", ApplicantVerificationSchema);

module.exports = {
    getVerificationDetails
};