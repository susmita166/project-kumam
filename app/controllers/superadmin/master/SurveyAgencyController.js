const SurveyAgency = require("../../../models/SurveyAgency")

const addSurveyAgency = async (req, res) => {
     // Create a new instance of SurveyAgency model
    const surveyAgencyModel = new SurveyAgency();
     // Check if the survey agency with the provided name already exists
    const surveyAgencyDetail = await surveyAgencyModel.fetchSurveyAgencyDetailByName(req.body.name, true);
    if (surveyAgencyDetail) {
        return res.status(409).json({
            message: 'Survey agency already exists.'
        });
    }
    // Add the survey agency
    const isAdded = await surveyAgencyModel.addSurveyAgency(req.body.name, req.body.address_one, req.body.address_two, req.body.zipcode, req.body.status, req.user_detail);
    if (!isAdded) {
        return res.status(500).json({
            message: 'Unable to add survey agency.'
        });
    }
     // Send a success response
    return res.json({
        message: 'Survey agency has been added.'
    });
}

const allSurveyAgencies = async (req, res) => {
     // Create an instance of the SurveyAgency model
    const surveyAgencyModel = new SurveyAgency();
     // Fetch all survey agencies from the database
    const surveyAgencies = await surveyAgencyModel.fetchAllSurveyAgencies(true);
      // Return the JSON response with the count and data of survey agencies
    return res.json({
        count: surveyAgencies.length,
        data: surveyAgencies
    });
}

const surveyAgencyDetail = async (req, res) => {
     // Create an instance of the SurveyAgency model
    const surveyAgencyModel = new SurveyAgency();
      // Fetch the survey agency detail by its ID from the database
    const surveyAgencyDetail = await surveyAgencyModel.fetchSurveyAgencyDetailByID(req.query.id, true);
      // If the survey agency detail is not found, send a 404 error response
    if (!surveyAgencyDetail) {
        return res.status(404).json({
            message: 'Survey agency not found.'
        });
    }
      // Return the survey agency detail in a JSON response
    return res.json({
        data: surveyAgencyDetail
    });
}

const editSurveyAgency = async (req, res) => {
    // Create an instance of the SurveyAgency model
    const surveyAgencyModel = new SurveyAgency();
     // Fetch the survey agency detail by its ID to check if it exists
    const surveyAgencyDetail = await surveyAgencyModel.fetchSurveyAgencyDetailByID(req.body.id, true);
     // If the survey agency detail is not found, send a 404 error response
    if (!surveyAgencyDetail) {
        return res.status(404).json({
            message: 'Survey agency not found.'
        });
    }
      // Edit the survey agency with the provided details
    const isUpdated = await surveyAgencyModel.editSurveyAgency(req.body.id, req.body.name, req.body.address_one, req.body.address_two, req.body.zipcode, req.body.status, req.user_detail);
      // If the survey agency was not updated successfully, send a 500 error response
    if (!isUpdated) {
        return res.status(500).json({
            message: 'Unable to update survey agency.'
        });
    }
    // Send a success response
    return res.json({
        message: 'Survey agency has been updated.'
    });
}

const deleteSurveyAgency = async (req, res) => {
     // Create an instance of the SurveyAgency model
    const surveyAgencyModel = new SurveyAgency();
     // Fetch the survey agency detail by its ID to check if it exists
    const surveyAgencyDetail = await surveyAgencyModel.fetchSurveyAgencyDetailByID(req.body.id, true);
     // If the survey agency detail is not found, send a 404 error response
    if (!surveyAgencyDetail) {
        return res.status(404).json({
            message: 'Survey agency not found.'
        });
    }
    // Delete the survey agency from the database
    const isDeleted = await surveyAgencyModel.deleteSurveyAgency(req.body.id, req.user_detail);
     // If the survey agency was not deleted successfully, send a 500 error response
    if (!isDeleted) {
        return res.status(500).json({
            message: 'Unable to delete survey agency.'
        });
    }
    // Send a success response
    return res.json({
        message: 'Survey agency has been deleted.'
    });
}

module.exports = {
    addSurveyAgency: addSurveyAgency,
    allSurveyAgencies: allSurveyAgencies,
    surveyAgencyDetail: surveyAgencyDetail,
    editSurveyAgency: editSurveyAgency,
    deleteSurveyAgency: deleteSurveyAgency
}