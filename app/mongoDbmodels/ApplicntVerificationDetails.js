const { default: mongoose } = require('mongoose');
const mongoDbConnection = require("../../util/mongoDbmodels/mongodb");
// const PersonalDetailsModel = require("../mongoDbmodels/PersonalDetails");
// const SpouseDetailsModel = require("../mongoDbmodels/SpouseDetails");
// const AttendantDetailsModel = require("../mongoDbmodels/AttendantDetails");
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

async function getVerificationDetailsBasedOnSpecificCondition(SpecificId) {
    try {
        const pipeline = [
            {
                $match: SpecificId
            },
            {
                $lookup: {
                    from: "allVerifedApplicantDetails",
                    localField: "ApplicationID",
                    foreignField: "ApplicationId",
                    as: "allVerifedApplicantDetails"
                }
            },
            {
                $unwind: "$allVerifedApplicantDetails"
            },
            {
                $project: {
                    id: "$id",
                    ApplcntID: "$ApplcntID",
                    RegistrationNo: "$allVerifedApplicantDetails.RegistrationNo",
                    Applicant_Name: "$allVerifedApplicantDetails.Applicant_Name",
                    ApplcntType: "$ApplcntType",
                    ApplicationID: "$ApplicationID",
                    TripGroupID: "$TripGroupID",
                    DistID: "$DistID"
                }
            }
        ];
        const result = await ApplicntVerificationDetails.aggregate(pipeline);
        return result;
    } catch (err) {
        console.error("Error in getVerificationDetailsBasedOnSpecificCondition:", err);
        throw err;
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
    getVerificationDetails,
    getVerificationDetailsBasedOnSpecificCondition
};