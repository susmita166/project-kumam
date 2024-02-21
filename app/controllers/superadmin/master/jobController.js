const jobModel = require("../../../mongoDbmodels/job");
const getfileuploadPath = require("../../../../config/fileUploadPath");
const getExpressValidator = require("../../../../middlewares/expressValidator");

const addJob = async (req, res) => {
    const jobData = req.body;
    const fileData = req.files;
    jobModel.createJob(jobData, req.user_detail, fileData)
    .then(newJob => {
        res.status(200).json({ Status:'true', Data: newJob, Message: 'Job created successfully' });
    })
    .catch(error => {
        getExpressValidator.removeUploadedFiles(fileData.BankDetails);
        getExpressValidator.removeUploadedFiles(fileData.EducationCertificate);
        res.status(error.status).json({ error: error.message });
    });
}

const editTheJob = async (req, res) => {
    try {
        const jobData = req.body;
        const editData = await jobModel.editJob(jobData, req.user_detail);
        res.status(200).json({ Status: 'true', Data: editData, Message: 'Job edit successfully' });
    } catch (error) {
        const statusCode = error.status || 500;
        res.status(statusCode).json({ Status: 'false', Data: {}, Message: error.message });
    }
}

const listJob = async (req, res) => {
    try {
        const jobData = req.body;
        if (Object.keys(jobData).length === 0) {
            const jobDetails = await jobModel.listJob();
            Object.keys(jobDetails).forEach((obj)=>{
                let jobDtBank = jobDetails[obj].BankDetails;
                let jobDtEducation = jobDetails[obj].EducationCertificateDetails;
                jobDetails[obj].BankDetails = [];
                jobDtBank.forEach((bankDt)=>{
                    let bankObj = {
                        path : `${process.env.BASE_URL}/${getfileuploadPath.module.jobDocs.dir_path}/${bankDt.filename}`,
                        fileName : bankDt.filename,
                        bankFileId: bankDt.bankFileId,
                    }
                    jobDetails[obj].BankDetails.push(bankObj);
                });
                jobDetails[obj].EducationCertificateDetails = [];
                jobDtEducation.forEach((EducationDt)=>{
                    let eductnObj = {
                        path : `${process.env.BASE_URL}/${getfileuploadPath.module.jobDocs.dir_path}/${EducationDt.filename}`,
                        fileName : EducationDt.filename,
                        EducationCertificateId: EducationDt.EducationCertificateId,
                    }
                    jobDetails[obj].EducationCertificateDetails.push(eductnObj);
                });
            });
            res.status(200).json({ Status: 'true', Data: jobDetails, Message: 'Employee list' });
        } else {
            let job = await jobModel.getJobDataBasedOnId(jobData.jobId);
            const jobDetails = job.toObject();
            let jobDescription = {};
            Object.keys(jobDetails).forEach(key => {
                if(key != "BankDetails" && key != "EducationCertificateDetails"){
                    jobDescription[key] = jobDetails[key];
                }
                if(key == "BankDetails"){
                    jobDescription.BankDetails = [];
                    jobDetails.BankDetails.forEach((obj)=>{
                        let bankDetails = {
                            path : `${process.env.BASE_URL}/${getfileuploadPath.module.jobDocs.dir_path}/${obj.filename}`,
                            fileName : obj.filename,
                            bankFileId: obj.bankFileId,
                        }
                        jobDescription.BankDetails.push(bankDetails);
                    });
                }
                if(key == "EducationCertificateDetails"){
                    jobDescription.EducationDetails =[];
                    jobDetails.EducationCertificateDetails.forEach((obj, index)=>{
                        let EducationDetails = {
                            path : `${process.env.BASE_URL}/${getfileuploadPath.module.jobDocs.dir_path}/${obj.filename}`,
                            fileName : obj.filename,
                            EducationCertificateId: obj.EducationCertificateId,
                        }
                        jobDescription.EducationDetails.push(EducationDetails);
                    });
                }
            });
            res.status(200).json({ Status: 'true', Data: jobDescription, Message: 'Job Details' });
        }
    } catch (error) {
        res.status(error.status || 500).json({ Status: 'false', Data: {}, Message: error.message || 'Internal Server Error' });
    }
}


const deleteJob = async (req, res) => {
    try {
        const jobData = req.body;
        const jobDetails = await jobModel.getJobDataBasedOnId(jobData.jobId);
        const deleteData = await jobModel.deleteJobbasedonId(jobDetails.jobId);
        res.status(deleteData.status).json({ Status: 'true', Message: deleteData.message });
    } catch (error) {
        res.status(error.status).json({ Status: 'false', Message: error.message });
    }
}



module.exports = {
	addJob,
    editTheJob,
    listJob,
    deleteJob
};