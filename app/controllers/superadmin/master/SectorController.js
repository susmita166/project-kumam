const Sector = require("../../../models/Sector")

const addSector = async (req, res) => {
    /** 
     * Creates a new instance of the Sector model
     */
    const sectorModel = new Sector();
    /** 
     * Fetches sector details by name from the database
     */
    const sectorDetail = await sectorModel.fetchSectorDetailByName(req.body.name, true);
    /** 
     * Checks if sector details already exist, and if so, returns an error response
     */
    if (sectorDetail) {
        return res.status(409).json({
            message: 'Sector already exists.'
        });
    }
    /** 
     * Adds the sector to the database using the Sector model
     */
    const isAdded = await sectorModel.addSector(req.body.name, req.body.status, req.user_detail);
    /** 
     * If the sector is not added successfully, returns an error response
     */
    if (!isAdded) {
        return res.status(500).json({
            message: 'Unable to add sector.'
        });
    }
    /** 
     * If the sector is added successfully, returns a success response
     */
    return res.json({
        message: 'Sector has been added.'
    });
}

const allSectors = async (req, res) => {
    /**
     * Creates a new instance of the Sector model
     */
    const sectorModel = new Sector();
    /** 
     * Fetches all sectors from the database
     */
    const sectors = await sectorModel.fetchAllSectors(true);
    /** 
     * Returns the count and data of the retrieved sectors
     */
    return res.json({
        count: sectors.length,
        data: sectors
    });
}

const sectorDetail = async (req, res) => {
    /** 
     * Creates a new instance of the Sector model
     */
    const sectorModel = new Sector();
    /** 
     * Fetches sector details by ID from the database
     */
    const sectorDetail = await sectorModel.fetchSectorDetailByID(req.query.id, true);
    /** 
     * Checks if sector details are found, and if not, returns a not found error response
     */
    if (!sectorDetail) {
        return res.status(404).json({
            message: 'Sector not found.'
        });
    }
    /** 
     * Returns the retrieved sector details
     */
    return res.json({
        data: sectorDetail
    });
}

const editSector = async (req, res) => {
    /** 
     * Creates a new instance of the Sector model
     */
    const sectorModel = new Sector();
    /** 
     * Fetches sector details by ID from the database
     */
    const sectorDetail = await sectorModel.fetchSectorDetailByID(req.body.id, true);
    /** 
     * Checks if sector details are found, and if not, returns a not found error response
     */
    if (!sectorDetail) {
        return res.status(404).json({
            message: 'Sector not found.'
        });
    }
    /** 
     * Updates the sector in the database using the Sector model
     */
    const isUpdated = await sectorModel.editSector(req.body.id, req.body.name, req.body.status, req.user_detail);
    /** 
     * If the sector is not updated successfully, returns an error response
     */
    if (!isUpdated) {
        return res.status(500).json({
            message: 'Unable to update sector.'
        });
    }
    /** 
     * Returns a success response after updating the sector
     */
    return res.json({
        message: 'Sector has been updated.'
    });
}

const deleteSector = async (req, res) => {
    /** 
     * Creates a new instance of the Sector model
     */
    const sectorModel = new Sector();
    /** 
     * Fetches sector details by ID from the database
     */
    const sectorDetail = await sectorModel.fetchSectorDetailByID(req.body.id, true);
    /** 
     * Checks if sector details are found, and if not, returns a not found error response
     */
    if (!sectorDetail) {
        return res.status(404).json({
            message: 'Sector not found.'
        });
    }
    /** 
     * Deletes the sector from the database using the Sector model
     */
    const isDeleted = await sectorModel.deleteSector(req.body.id, req.user_detail);
    /** 
     * If the sector is not deleted successfully, returns an error response
     */
    if (!isDeleted) {
        return res.status(500).json({
            message: 'Unable to delete sector.'
        });
    }
    /** 
     * Returns a success response after deleting the sector
     */
    return res.json({
        message: 'Sector has been deleted.'
    });
}

module.exports = {
    addSector: addSector,
    allSectors: allSectors,
    sectorDetail: sectorDetail,
    editSector: editSector,
    deleteSector: deleteSector
}