const PersonalDetailsModel = require("../../../mongoDbmodels/PersonalDetails");
const SpouseDetailsModel = require("../../../mongoDbmodels/SpouseDetails");
const AttendantDetailsModel = require("../../../mongoDbmodels/AttendantDetails");
const DistrictMasterModel = require("../../../mongoDbmodels/DistrictMaster");
const getfileuploadPath = require("../../../../config/fileUploadPath");
const getExpressValidator = require("../../../../middlewares/expressValidator");
const moment = require('moment');

const currentDate = moment().format("YYYY-MM-DD HH:mm:ss");

const insertDetails = async (req, res) => {
    let requestData = req.body;
    let requestFiles = req.files;
    let userDetails = req.user_detail;

    const [getLastRecordOfPersonalDetails, getLastRecordOfSpouseDetails, getLastRecordOfAttendantDetails] = await Promise.all([
         PersonalDetailsModel.getLastRecord(),
         SpouseDetailsModel.getLastRecord(),
         AttendantDetailsModel.getLastRecord()
    ]);
    let personalData = {
        id:getLastRecordOfPersonalDetails[0].id+1,
        Scheme_Id : requestData.Scheme_Id,
        TripGroupID : requestData.TripGroupID,
        Domicile_DistId : requestData.Domicile_DistId,
        Applicant_Name : requestData.Applicant_Name,
        DOB : requestData.DOB,
        Do_You_Wish_To_Avail_Attendant : requestData.Do_You_Wish_To_Avail_Attendant,
        Aadhar_No : requestData.Aadhar_No,
        Mobile_No : requestData.Mobile_No,
        Email_Id : requestData.Email_Id,
        Photo : req.files.Photo[0].path,
        Identity_Proof_Document : req.files.Identity_Proof_Document[0].path,
        User_Id:userDetails.id,
        CreatedBy:userDetails.id,
        CreatedOn:currentDate,
        ModifiedBy:userDetails.id,
        ModifiedOn:currentDate
    };
    let insertPersonalDetailsData = await PersonalDetailsModel.insertPersonalDetails(personalData);
    let spouseData = {
        id:getLastRecordOfSpouseDetails[0].id+1,
        ApplicationId : insertPersonalDetailsData.id,
        Spouce_Name : requestData.Spouce_Name,
        DOB : requestData.SpouseDOB,
        Aadhar_No : requestData.Spouse_Aadhar_No,
        Photo : req.files.Spose_Photo[0].path,
        marriage_proof_doc : req.files.marriage_proof_doc[0].path,
        CreatedBy:userDetails.id,
        CreatedOn:currentDate,
        ModifiedBy:userDetails.id,
        ModifiedOn:currentDate
    };
    let AttendantData = {
        id:getLastRecordOfAttendantDetails[0].id+1,
        ApplicationId : insertPersonalDetailsData.id,
        Attendant_Name : requestData.Attendant_Name,
        DOB : requestData.attendantDOB,
        Aadhar_No : requestData.attendantAadhar_No,
        Photo : req.files.Attendant_Photo[0].path,
        CreatedBy:userDetails.id,
        CreatedOn:currentDate,
        ModifiedBy:userDetails.id,
        ModifiedOn:currentDate
    };
    
    if(requestData.Spouce_Name){
        var insertSpouseDetailsData = await SpouseDetailsModel.insertSpouseDEtails(spouseData);
    }
    if(requestData.Attendant_Name){
        var insertAttendantDetailsData = await AttendantDetailsModel.insertAttendantDetails(AttendantData);
    }

    res.status(200).json({ 
        Status:'true', 
        Data: [], 
        Message: 'Data Insert Successfully' 
    });
}

const editDetails = async (req, res) => {
    try{
        let requestData = req.body;
        let requestFiles = req.files;
        let userDetails = req.user_detail;
    
        const [getPersonalDetails, getSpouseDetails, getAttendantDetails] = await Promise.all([
             PersonalDetailsModel.getPrsnlDt(requestData.ApplicationId),
             SpouseDetailsModel.getSpouseDt(requestData.ApplicationId),
             AttendantDetailsModel.getAttendantDt(requestData.ApplicationId)
        ])
    
        let personalData = {
            Scheme_Id : requestData.Scheme_Id,
            TripGroupID : requestData.TripGroupID,
            Domicile_DistId : requestData.Domicile_DistId,
            Applicant_Name : requestData.Applicant_Name,
            DOB : requestData.DOB,
            Do_You_Wish_To_Avail_Attendant : requestData.Do_You_Wish_To_Avail_Attendant,
            Aadhar_No : requestData.Aadhar_No,
            Mobile_No : requestData.Mobile_No,
            Email_Id : requestData.Email_Id,
            Photo : req.files.Photo[0].path ? req.files.Photo[0].path : null,
            Identity_Proof_Document : req.files.Identity_Proof_Document[0].path ? req.files.Identity_Proof_Document[0].path: null,
            User_Id:userDetails.id,
            ModifiedBy:userDetails.id,
            ModifiedOn:currentDate
        };
        if(getPersonalDetails){
            await PersonalDetailsModel.updateData(requestData.ApplicationId, personalData);
        }
        if(requestData.Spouce_Name && getSpouseDetails){
            let spouseData = {
                Spouce_Name : requestData.Spouce_Name,
                DOB : requestData.SpouseDOB,
                Aadhar_No : requestData.Spouse_Aadhar_No,
                Photo : req.files.Spose_Photo ? req.files.Spose_Photo[0].path : null,
                marriage_proof_doc : req.files.marriage_proof_doc ? req.files.marriage_proof_doc[0].path : null,
                CreatedBy:userDetails.id,
                CreatedOn:currentDate,
                ModifiedBy:userDetails.id,
                ModifiedOn:currentDate
            };
            var insertSpouseDetailsData = await SpouseDetailsModel.updateData(requestData.ApplicationId, spouseData);
        }
        if(requestData.Attendant_Name && getAttendantDetails){
            let AttendantData = {
                Attendant_Name : requestData.Attendant_Name,
                DOB : requestData.attendantDOB,
                Aadhar_No : requestData.attendantAadhar_No,
                Photo : req.files.Attendant_Photo ? req.files.Attendant_Photo[0].path : null,
                CreatedBy:userDetails.id,
                CreatedOn:currentDate,
                ModifiedBy:userDetails.id,
                ModifiedOn:currentDate
            };
            var insertAttendantDetailsData = await AttendantDetailsModel.updateData(requestData.ApplicationId, AttendantData);
        }
        res.status(200).json({ 
            Status:'true', 
            Data: [], 
            Message: 'Data Update Successfully' 
        });
    }catch (error) {
		return res.status(500).json({
			message: "Error",
			error: error.toString()
		});
	}
}

const listDetails = async(req, res) =>{
    try{
        let requestData = req.body;
        let objectLength = Object.keys(requestData.ApplicationId).length;
        if(requestData.ApplicationId == ""){
            let limit = requestData.limit;
            let skip = (requestData.page-1)*requestData.limit;
            let personalDetails = await PersonalDetailsModel.getAllPersnlDt(limit , skip);
            const getPersnlDtsIds = personalDetails.map(item => item.id);
            let [spouseDetails, attendantDetails] = await Promise.all([
                SpouseDetailsModel.getDataBasedOnApplicationIds(getPersnlDtsIds),
                AttendantDetailsModel.getDataBasedOnApplicationIds(getPersnlDtsIds)
            ]);

            personalDetails.forEach((item, index) =>{
                const spouseDt = spouseDetails.find(spouseDetails => item.id == spouseDetails.ApplicationId);
                personalDetails[index]._doc.spouseDetail = spouseDt || null;
                const attendantDt = attendantDetails.find(attendantDetails => item.id == attendantDetails.ApplicationId);
                personalDetails[index]._doc.attendanntDetails = attendantDt||null;
            })
            res.status(200).json({
                status:true,
                count: personalDetails.length,
                data: personalDetails
            });
        }
        else{
            const [personalDetails, spouseDetails, attendantDetails] = await Promise.all([
                PersonalDetailsModel.getPrsnlDt(requestData.ApplicationId),
                SpouseDetailsModel.getSpouseDt(requestData.ApplicationId),
                AttendantDetailsModel.getAttendantDt(requestData.ApplicationId)
            ]);
            // Here by using this assign operator we merge the object
            // let mergedData = Object.assign( {}, personalDetails._doc, spouseDetails, attendantDetails[0]._doc);

            let mergedData ={...personalDetails._doc, spouseDetail:spouseDetails, attendantDetails:attendantDetails};
            res.status(200).json({ 
                Status:'true', 
                Data: mergedData, 
                Message: 'User Details' 
            });
        }
    }
    catch(error){
        res.status(error.status || 500).json({ Status: 'false', Data: {}, Message: error.message || 'Internal Server Error' });
    }
}


const deleteDetails = async(req, res) => {
    try{
        let requestData = req.body;
        if(requestData.ApplicationId){
            let [dltPersnlDt, dltSpouseDt, dltAttendntDt] = await Promise.all([
                PersonalDetailsModel.deletePersnlDt(requestData.ApplicationId),
                SpouseDetailsModel.deleteSpouseDt(requestData.ApplicationId),
                AttendantDetailsModel.deleteAttendant(requestData.ApplicationId),
            ]);
            res.status(200).json({
                Status:'True',
                Data:[],
                Message:"Data Deleted Successfully"
            })
        }
    }catch(error){
        res.status(500).json({
            Status:'False',
            Message: "Error",
			Error: error.toString()
        })
    }
}

const generateRegistrationNumber = async(req, res) =>{
    try{
        const requestData = req.body;
        const getPersnlDts = await PersonalDetailsModel.getPrsnlDt(requestData.ApplicationId);
        const getDistrictCode = await DistrictMasterModel.getDistrictCode(getPersnlDts.Domicile_DistId);
        const getAppctnReg = await PersonalDetailsModel.getAllReg(getPersnlDts.Scheme_Id, getPersnlDts.Domicile_DistId);
        let totalApplication = 0;
        if(getAppctnReg.length==0){
            totalApplication++;
        }else{
            console.log(typeof getAppctnReg[0].RegistrationNo);
            totalApplication = parseInt(getAppctnReg[0].RegistrationNo)+1;
        }
        const padRegistration = totalApplication.toString().padStart(getAppctnReg[0].RegistrationNo.length, '0');
        const padRequestNoPerson = requestData.no_of_person.padStart(2, '0');
        const regNumber = getDistrictCode.Dist_Code+'-'+padRequestNoPerson+'-'+padRegistration;
        let genRegNo = {
            RegistrationNo:regNumber
        }
        await PersonalDetailsModel.updateData(requestData.ApplicationId, genRegNo);
        const getPersnlDtsAfterModification = await PersonalDetailsModel.getPrsnlDt(requestData.ApplicationId);
        res.status(200).json({ 
            Status:'true', 
            Data: getPersnlDtsAfterModification, 
            Message: 'Registration Number Generate Sucessfully' 
        });
      

    }catch(error){
        console.log(error);
        res.status(500).json({
            Status:"False",
            Message:"Error",
            Error: error.toString()
        })
    }
   
}




module.exports={
    insertDetails,
    editDetails,
    listDetails,
    deleteDetails,
    generateRegistrationNumber
}