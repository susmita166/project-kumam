const SourceOfFund = require("../../../models/SourceOfFund")

const addSourceOfFund = async (req, res) => {
    /**
     * Create a new instance of the `SourceOfFund` model
     */
    const sourceOfFundModel = new SourceOfFund();
    /**
     * Fetch the source of fund detail by name from the model and store it in `sourceOfFundDetail`
     */
    const sourceOfFundDetail = await sourceOfFundModel.fetchSourceOfFundDetailByName(req.body.name, true);
    /**
     * Check if the source of fund detail exists
     */
    if (sourceOfFundDetail) {
        /**
         * Return 409 status with a JSON object containing a message if the source of fund already exists
         */
        return res.status(409).json({
            message: 'Source of fund already exists.'
        });
    }
    /**
     * Add the source of fund and store the result in `isAdded`
     */
    const isAdded = await sourceOfFundModel.addSourceOfFund(req.body.name, req.body.status, req.user_detail);
    /**
     * Check if the source of fund was added successfully
     */
    if (!isAdded) {
        /**
         * Return 500 status with a JSON object containing a message if the source of fund was not added successfully
         */
        return res.status(500).json({
            message: 'Unable to add source of fund.'
        });
    }
    /**
     * Return a JSON object with a message indicating that the source of fund has been added
     */
    return res.json({
        message: 'Source of fund has been added.'
    });
}

const allSourceOfFunds = async (req, res) => {
    /**
     * Create a new instance of the `SourceOfFund` model
     */
    const sourceOfFundModel = new SourceOfFund();
    /**
     * Fetch all the source of funds and store the result in `sourceOfFunds`
     */
    const sourceOfFunds = await sourceOfFundModel.fetchAllSourceOfFunds(true);
    /**
     * Return a JSON object with the count of source of funds and the source of funds data
     */
    return res.json({
        count: sourceOfFunds.length,
        data: sourceOfFunds
    });
}

const sourceOfFundDetail = async (req, res) => {
    /**
     * Create a new instance of the `SourceOfFund` model
     */
    const sourceOfFundModel = new SourceOfFund();
    /**
     * Fetch the source of fund detail by ID from the model and store it in `sourceOfFundDetail`
     */
    const sourceOfFundDetail = await sourceOfFundModel.fetchSourceOfFundDetailByID(req.query.id, true);
    /**
     * Check if the source of fund detail does not exist
     */
    if (!sourceOfFundDetail) {
        /**
         * Return 404 status with a JSON object containing a message if the source of fund was not found
         */
        return res.status(404).json({
            message: 'Source of fund not found.'
        });
    }
    /**
     * Return a JSON object with the source of fund detail data
     */
    return res.json({
        data: sourceOfFundDetail
    });
}

const editSourceOfFund = async (req, res) => {
    /**
     * Create a new instance of the `SourceOfFund` model
     */
    const sourceOfFundModel = new SourceOfFund();
    /**
     * Fetch the source of fund detail by ID from the model and store it in `sourceOfFundDetail`
     */
    const sourceOfFundDetail = await sourceOfFundModel.fetchSourceOfFundDetailByID(req.body.id, true);
    /**
     * Check if the source of fund detail does not exist
     */
    if (!sourceOfFundDetail) {
        /**
         * Return 404 status with a JSON object containing a message if the source of fund was not found
         */
        return res.status(404).json({
            message: 'Source of fund not found.'
        });
    }
    /**
     * Update the source of fund and store the result in `isUpdated`
     */
    const isUpdated = await sourceOfFundModel.editSourceOfFund(req.body.id, req.body.name, req.body.status, req.user_detail);
    /**
     * Check if the source of fund was updated successfully
     */
    if (!isUpdated) {
        /**
         * Return 500 status with a JSON object containing a message if the source of fund was not updated successfully
         */
        return res.status(500).json({
            message: 'Unable to update source of fund.'
        });
    }
    /**
     * Return a JSON object with a message indicating that the source of fund has been updated
     */
    return res.json({
        message: 'Source of fund has been updated.'
    });
}

const deleteSourceOfFund = async (req, res) => {
    /**
     * Create a new instance of the `SourceOfFund` model
     */
    const sourceOfFundModel = new SourceOfFund();
    /**
     * Fetch the source of fund detail by ID from the model and store it in `sourceOfFundDetail`
     */
    const sourceOfFundDetail = await sourceOfFundModel.fetchSourceOfFundDetailByID(req.body.id, true);
    /**
     * Check if the source of fund detail does not exist
     */
    if (!sourceOfFundDetail) {
        /**
         * Return 404 status with a JSON object containing a message if the source of fund was not found
         */
        return res.status(404).json({
            message: 'Source of fund not found.'
        });
    }
    /**
     * Delete the source of fund and store the result in `isDeleted`
     */
    const isDeleted = await sourceOfFundModel.deleteSourceOfFund(req.body.id, req.user_detail);
    /**
     * Check if the source of fund was deleted successfully
     */
    if (!isDeleted) {
        /**
         * Return 500 status with a JSON object containing a message if the source of fund was not deleted successfully
         */
        return res.status(500).json({
            message: 'Unable to delete source of fund.'
        });
    }
    /**
     * Return a JSON object with a message indicating that the source of fund has been deleted
     */
    return res.json({
        message: 'Source of fund has been deleted.'
    });
}

module.exports = {
    addSourceOfFund: addSourceOfFund,
    allSourceOfFunds: allSourceOfFunds,
    sourceOfFundDetail: sourceOfFundDetail,
    editSourceOfFund: editSourceOfFund,
    deleteSourceOfFund: deleteSourceOfFund
}