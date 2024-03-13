const PersonalDetailsModel = require("../../../mongoDbmodels/PersonalDetails");
const SpouseDetailsModel = require("../../../mongoDbmodels/SpouseDetails");
const AttendantDetailsModel = require("../../../mongoDbmodels/AttendantDetails");
const DistrictMasterModel = require("../../../mongoDbmodels/DistrictMaster");
const ApplicntVerificationDetailsModel = require("../../../mongoDbmodels/ApplicntVerificationDetails");
const getfileuploadPath = require("../../../../config/fileUploadPath");
const getExpressValidator = require("../../../../middlewares/expressValidator");
const moment = require('moment');

const currentDate = moment().format("YYYY-MM-DD HH:mm:ss");


const applicantVerificationDetails = async (req, res) => {
    try {
        let requestData = req.body;
        let limit = requestData.limit;
        let skip = (requestData.page - 1) * limit; 
        let applicantDetails = await ApplicntVerificationDetailsModel.getVerificationDetails(limit, skip);
        let ids = applicantDetails.map(data => data.ApplcntID);
        let [personalDetails, spouseDetails, attendantDetails] = await Promise.all([
            PersonalDetailsModel.getDataBasedOnApplicationIds(ids),
            SpouseDetailsModel.getDataBasedOnApplicationIds(ids),
            AttendantDetailsModel.getDataBasedOnApplicationIds(ids)
        ]);
        applicantDetails.forEach((item, index) =>{
            const persnlDt = item.ApplcntType == "P" ? personalDetails.find(persnlDt => item.ApplcntID == persnlDt.id) : null;
            const spouseDt = item.ApplcntType == "S" ? spouseDetails.find(spouseDt => item.ApplcntID == spouseDt.id) : null;
            const attendntDt = item.ApplcntType == "A" ? attendantDetails.find(attendantDt => item.ApplcntID == attendantDt.id) : null;
            if(persnlDt){
                item._doc.Applicant_Name = persnlDt.Applicant_Name;
                item._doc.RegistrationNo = persnlDt.RegistrationNo;
            }
            if(spouseDt){
                item._doc.Applicant_Name = spouseDt.Spouce_Name;
                const matchedPersonalDetail = personalDetails.find(p => p.id === spouseDt.ApplicationId);
                if (matchedPersonalDetail) {
                    item._doc.registration = matchedPersonalDetail.RegistrationNo;
                }
            }
            if(attendntDt){
                item._doc.Applicant_Name = attendntDt.Attendant_Name;
                const matchedPersonalDetail = personalDetails.find(p => p.id === attendntDt.ApplicationId);
                if (matchedPersonalDetail) {
                    item._doc.registration = matchedPersonalDetail.RegistrationNo;
                }
            }
        })
        res.status(200).json({
            status: true,
            data: applicantDetails

        });
    } catch (error) {
        console.log(error);
        res.status(error.status || 500).json({ status: false, data: {}, message: error.message || 'Internal Server Error' });
    }
}










module.exports={
    applicantVerificationDetails
}