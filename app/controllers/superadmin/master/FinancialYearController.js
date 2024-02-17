const FinancialYear = require("../../../models/FinancialYear")

const addFinancialYear = async (req, res) => {
    /*
     Create an instance of the FinancialYear model
     */
    const financialYearModel = new FinancialYear();
    /*
     Fetch details of the financial year by its name
     */
    const financialYearDetail = await financialYearModel.fetchFinancialYearDetailByName(req.body.name, true);
    /*
      Check if the financial year details already exist
     */
    if (financialYearDetail) {
        return res.status(409).json({
            message: 'Financial year already exists.'
        });
    }
    /*
      Add a new financial year to the database
     */
    const isAdded = await financialYearModel.addFinancialYear(req.body.name, req.body.status, req.user_detail);
    /*
      Check if the financial year was successfully added
     */
    if (!isAdded) {
        return res.status(500).json({
            message: 'Unable to add financial year.'
        });
    }
    /*
      Return a success message after adding the financial year
     */
    return res.json({
        message: 'Financial year has been added.'
    });
}

const allFinancialYears = async (req, res) => {
    /*
     Create a new instance of the FinancialYear model
     */
    const financialYearModel = new FinancialYear();
    /*
      Fetch all financial years from the database and store the result in the financialYears variable
     */
    const financialYears = await financialYearModel.fetchAllFinancialYears(true);
    /*
      Return a JSON response with the count of financial years and the data itself
     */
    return res.json({
        count: financialYears.length,
        data: financialYears
    });
}

const financialYearDetail = async (req, res) => {
    /*
     Create a new instance of the FinancialYear model
     */
    const financialYearModel = new FinancialYear();
    /*
      Fetch the financial year detail from the database based on the provided ID and store the result in the financialYearDetail variable
     */
    const financialYearDetail = await financialYearModel.fetchFinancialYearDetailByID(req.query.id, true);
    /*
     Check if the financial year detail is not found, return a 404 status with an error message
     */
    if (!financialYearDetail) {
        return res.status(404).json({
            message: 'Financial year not found.'
        });
    }
    /*
      Return a JSON response with the financial year detail
     */
    return res.json({
        data: financialYearDetail
    });
}

const editFinancialYear = async (req, res) => {
    /*
     Create a new instance of the FinancialYear model
     */
    const financialYearModel = new FinancialYear();
    /*
      Fetch the financial year detail from the database based on the provided ID and store the result in the financialYearDetail variable
     */
    const financialYearDetail = await financialYearModel.fetchFinancialYearDetailByID(req.body.id, true);
    /*
      Check if the financial year detail is not found, return a 404 status with an error message
     */
    if (!financialYearDetail) {
        return res.status(404).json({
            message: 'Financial year not found.'
        });
    }
    /*
     Update the financial year details with the provided information and user details
     */
    const isUpdated = await financialYearModel.editFinancialYear(req.body.id, req.body.name, req.body.status, req.user_detail);
    /*
      Check if the financial year update was successful, if not, return a 500 status with an error message
     */
    if (!isUpdated) {
        return res.status(500).json({
            message: 'Unable to update financial year.'
        });
    }
    /*
      Return a JSON response with a success message
     */
    return res.json({
        message: 'Financial year has been updated'
    });
}

const deleteFinancialYear = async (req, res) => {
    /*
      Create a new instance of the FinancialYear model
     */
    const financialYearModel = new FinancialYear();
    /*
      Fetch the financial year detail from the database based on the provided ID and store the result in the financialYearDetail variable
     */
    const financialYearDetail = await financialYearModel.fetchFinancialYearDetailByID(req.body.id, true);
    /*
      Check if the financial year detail is not found, return a 404 status with an error message
     */
    if (!financialYearDetail) {
        return res.status(404).json({
            message: 'Financial year not found.'
        });
    }
    /*
      Delete the financial year with the provided ID and user details
     */
    const isDeleted = await financialYearModel.deleteFinancialYear(req.body.id, req.user_detail);
    /*
      Check if the financial year delete operation was successful, if not, return a 500 status with an error message
     */
    if (!isDeleted) {
        return res.status(500).json({
            message: 'Unable to delete financial year.'
        });
    }
    /*
      Return a JSON response with a success message
     */
    return res.json({
        message: 'Financial year has been deleted'
    });
}

module.exports = {
    addFinancialYear: addFinancialYear,
    allFinancialYears: allFinancialYears,
    financialYearDetail: financialYearDetail,
    editFinancialYear: editFinancialYear,
    deleteFinancialYear: deleteFinancialYear
}