const { default: mongoose } = require('mongoose');
const mongoDbConnection = require("../../util/mongoDbmodels/mongodb");
const { error, createLogger } = require('winston');

async function createJob(jobData, userDetail, fileData) {
    try {
        const foundJob = await Job.findOne({ $or: [{ email: jobData.email }, { jobId: jobData.jobId }] });
        const getBankData = fileData.BankDetails;
        const getEducationCertificateData = fileData.EducationCertificate;
        if(getBankData){
            getBankData.forEach((obj, index)=>{
                obj.bankFileId = index +1;
            });
        }
        if(getEducationCertificateData){
            getEducationCertificateData.forEach((obj, index)=>{
                obj.EducationCertificateId = index +1;
            });
        }
        if (foundJob) {
            throw { message: 'A job with the same email or job ID already exists', status: 422 };
        }else{
            const newJob = await Job.create({
                firstName: jobData.firstName,
                lastName: jobData.lastName,
                Phone_number: jobData.Phone_number,
                email: jobData.email,
                jobId: jobData.jobId,
                Location: jobData.Location, 
                gender: jobData.gender,
                status: jobData.status,
                createdBy:userDetail.id,
                BankDetails: getBankData,
                EducationCertificateDetails:getEducationCertificateData
            });
            return newJob;
        }
    } catch (error) {
        throw error;
    }
}

const editJob = async (jobData, userDetail) => {
    try {
        const jobDetails = await getJobDataBasedOnId(jobData.jobId);
        jobDetails.firstName = jobData.firstName;
        jobDetails.lastName = jobData.lastName;
        jobDetails.Phone_number = jobData.Phone_number;
        jobDetails.email = jobData.email;
        jobDetails.Location = jobData.Location;
        jobDetails.gender = jobData.gender;
        jobDetails.status = jobData.status;
        jobDetails.createdBy = userDetail.id;

        const savedJob = await updateDataBasedOnId(jobDetails);
        return savedJob; // Resolve with the saved job details
    } catch (error) {
        throw error; // Throw the error
    }
}


function getJobDataBasedOnId(JobId) {
    return new Promise((resolve, reject) => {
        Job.findOne({ jobId: JobId })
            .then(jobData => {
                if (!jobData) {
                    const error = new Error('No data found for JobId: ' + JobId);
                    error.status = 404;
                    reject(error);
                } else {
                    resolve(jobData); // Resolve with the job data
                }
            })
            .catch(error => {
                const customError = new Error('Error retrieving job data for JobId: ' + JobId);
                customError.status = 500; 
                reject(customError);
            });
    });
}

function updateDataBasedOnId(jobDetails) {
    return new Promise((resolve, reject) => {
        jobDetails.save()
            .then(savedJob => {
                resolve(savedJob); // Resolve with the saved job details
            })
            .catch(error => {
                reject(error); // Reject with the error
            });
    });
}

function listJob(){
    return new Promise((resolve, reject) =>{
        Job.find({})
        .then(jobDetails => {
            resolve(jobDetails);
        })
        .catch(error => {
            reject({ statusCode: 500, message: 'No data found' });
        });
    });
}


function deleteJobbasedonId(jobId){
    return new Promise((resolve, reject) =>{
    Job.deleteOne({jobId:jobId})
    .then(deletedJob =>{
        resolve({ 
            message: `Job data deleted successfully for this id: ${jobId}`,
            status: 200 });
        })
    .catch(error =>{
        reject({ 
            message: `unable to delete job details for this id: ${jobId}`,
            status: 500 });
        })
    });
}



// THere is a another way to update the job except the method save
//     const updatedJob = {
//         firstName: jobData.firstName,
//         lastName: jobData.lastName,
//         Phone_number: jobData.Phone_number,
//         email: jobData.email,
//         Location: jobData.Location, 
//         gender: jobData.gender,
//         status: jobData.status,
//         createdBy: userDetail.id
//     };
//     const editJob = await Job.findOneAndUpdate(
//         { jobId: jobData.jobId },
//         updatedJob, 
//         { new: true, runValidators: true } 
//     );


const jobSchema = new mongoDbConnection.Schema({
    firstName:{
        type : String,
        required :true
    },
    lastName:{
        type : String,
        required :true
    },
    Phone_number : {
        type : String,
        required :true
    },
    email : {
        type : String,
        required :true,
        unique:true
    },
    jobId : {
        type : String,
        required :true,
        unique:true
    },
    Location : {
        type : String,
        required :true
    },
    jobTitle: {
        type : String,
    },
    gender: {
        type : String,
    },
    createdBy: {
        type : Number,
    },
    BankDetails: [{ type: Object }],
    EducationCertificateDetails: [{ type: Object }]
},{timestamps:true});

const Job = mongoose.model("Job", jobSchema);

module.exports = {
    Job,
    createJob,
    editJob,
    listJob,
    getJobDataBasedOnId,
    deleteJobbasedonId
};

