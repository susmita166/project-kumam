const jobModel = require("../../../mongoDbmodels/job");


const addJob = async (req, res) => {
    const jobData = req.body;
    const fileData = req.files;
    jobModel.createJob(jobData, req.user_detail, fileData)
    .then(newJob => {
        res.status(200).json({ Status:'true', Data: newJob, Message: 'Job created successfully' });
    })
    .catch(error => {
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
        // console.log(error);
        res.status(statusCode).json({ Status: 'false', Data: {}, Message: error.message });
    }
}


const listJob = async (req, res) => {
    try {
        const jobData = req.body;
        if (Object.keys(jobData).length === 0) {
            const jobDetails = await jobModel.listJob();
            res.status(200).json({ Status: 'true', Data: jobDetails, Message: 'Employee list' });
        } else {
            const jobDetails = await jobModel.getJobDataBasedOnId(jobData.jobId);
            res.status(200).json({ Status: 'true', Data: jobDetails, Message: 'Job Details' });
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