const jobModel = require("../../../mongoDbmodels/job");

const addJob = async (req, res) => {
    const jobData = req.body;
    jobModel.createJob(jobData, req.user_detail)
    .then(newJob => {
        res.status(200).json({ Status:'true', Data: newJob, Message: 'Job created successfully' });
    })
    .catch(error => {
        res.status(error.status).json({ error: error.message });
    });
}

const editJob = async(req, res) =>{
    const jobData = req.body;
    jobModel.editJob(jobData, req.user_detail)
    .then(editData => {
        res.status(200).json({ Status:'true', Data: editData ,Message: 'Job edit successfully'});
    })
    .catch(error => {
        const statusCode = error.status || 500;
        // console.log(error);
        res.status(error.status).json({ Status:'false', Data: {} ,Message: error.message });
    })
}

const listJob = async(req, res) =>{
    const jobData = req.body;
    if(Object.keys(jobData).length == 0){
        jobModel.listJob()
        .then(jobDetails =>{
            res.status(200).json({ Status:'true', Data: jobDetails ,Message: 'Employee list'});
        })
        .catch(error =>{
            console.log(error);
            res.status(error.status).json({ Status:'false', Data: {} ,Message: error.message });
        })
    }else{
        jobModel.getJobDataBasedOnId(jobData.jobId)
        .then(jobDetails =>{
            res.status(200).json({ Status:'true', Data: jobDetails ,Message: 'Job Details'});
        })
        .catch(error =>{
            console.log(error);
            res.status(error.status).json({ Status:'false', Data: {} ,Message: error.message });
        })
    }
}

const deleteJob = async (req, res) => {
    const jobData = req.body;
    jobModel.getJobDataBasedOnId(jobData.jobId)
    .then(jobDetails => {
        return jobModel.deleteJobbasedonId(jobDetails.jobId);
       // res.status(200).json({ Status:'true', Data: newJob, Message: 'Job created successfully' });
    })
    .then(deleteData =>{
        res.status(deleteData.status).json({ Status:'true', Message: deleteData.message });
    })
    .catch(error => {
        res.status(error.status).json({ Status:'false',Message: error.message });
    });
}


module.exports = {
	addJob,
    editJob,
    listJob,
    deleteJob
};