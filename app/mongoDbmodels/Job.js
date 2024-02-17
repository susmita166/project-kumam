const { default: mongoose } = require('mongoose');
const mongoDbConnection = require("../../util/mongodb");
const { error, createLogger } = require('winston');

async function createJob(jobData, userDetail) {
    try {
        const foundJob = await Job.findOne({ $or: [{ email: jobData.email }, { jobId: jobData.jobId }] });
        console.log(foundJob);
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
                createdBy:userDetail.id
            });
            return newJob;
        }
    } catch (error) {
        throw error;
    }
}

function editJob(jobData, userDetail) {
    return new Promise((resolve, reject) => {
        getJobDataBasedOnId(jobData.jobId)
            .then(jobDetails => {
                jobDetails.firstName = jobData.firstName;
                jobDetails.lastName = jobData.lastName;
                jobDetails.Phone_number = jobData.Phone_number;
                jobDetails.email = jobData.email;
                jobDetails.Location = jobData.Location;
                jobDetails.gender = jobData.gender;
                jobDetails.status = jobData.status;
                jobDetails.createdBy = userDetail.id;
                return updateDataBasedOnId(jobDetails);
            })
            .then(savedJob => {
                console.log(savedJob);
                resolve(savedJob); // Resolve with the saved job details
            })
            .catch(error => {
                reject(error); // Reject with the error
            });
    });
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
        console.log(deletedJob);
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
    }
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

