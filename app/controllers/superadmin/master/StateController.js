const State = require("../../../models/State");
const logger = require("../../../../util/logger");
const {
	Op
} = require('sequelize');
const { getAsync, setAsync } = require('../../../../util/redis');

const addState = async (req, res) => {
    try {
        /* create an instance of the State model */
        const stateModel = new State();
        /* Extract State data from the request body */
        const stateData = req.body;
        /*  Check if a State with the same name already exists */
        const existingState = await State.findOne({
            where: {
                name: stateData.name,
                status: {
					[Op.ne]: State.STATUS_DELETED
				}
            }
        });
        if (existingState) {
            return res.status(409).json({
                message: "State already exists"
            });
        }
        /* Create a new State using the stateModel instance */
        const isCreated = await stateModel.createState(stateData, req.body.status, req.user_detail);
        if (!isCreated) {
            return res.status(500).json({
                message: 'Unable to create state'
            });
        }
        /* Return success message if the State creation is successful */
        return res.json({
            message: "State has been created"
        });
    } catch (error) {
        /* Return an error message if any exception occurs during State creation */
        return res.status(500).json({
            message: "Unable to create state"
        });
    }
};

const statelist = async (req, res) => {
    /* Call the listStates method to fetch a list of States */
    let data = [];
    try {
        data = getAsync('all_states')
        if (data) {
            data = JSON.parse(data);
        }
    } catch (err) {
        logger.error(err.toString());
    }
    data = await State.fetchAllStates();
    setAsync('all_states', JSON.stringify(data));
    /* Return a JSON response with the count of State and the data itself */
    return res.json({
        count: data.length,
        data: data
    })
}

const singleState = async (req, res) => {
    /* Call the singlestate method to fetch details of a specific State */
    const data = await State.fetchStateDetailsByID(req.query.id)
    /* Return a 404 status if no State is found with the provided state_id */
    if (!data) {
        return res.status(404).json({
            message: "State not found"
        });
    }
    /* Return the fetched State details */
    return res.json({
        data: data
    })
}

const updateState = async (req, res) => {
    try {
        /* Extract the State ID from the request body */
        const {
            id
        } = req.body;
        /* Check if the provided State ID exists in the State model */
        const existingStateID = await State.findOne({
            where: {
                id: id,
                status: {
					[Op.ne]: State.STATUS_DELETED
				}
            }
        });
        if (!existingStateID) {
            return res.status(404).json({
                message: 'State not found.'
            });
        }
        /* Call the updateStateByID method and update the State details with the provided information and user details */
        const isUpdated = await State.updateStateByID(req.body, req.user_detail);
        if (!isUpdated) {
            return res.status(500).json({
                message: 'Unable to update the state'
            });
        }
        /* Return a JSON response with a success message */
        return res.json({
            message: "State has been updated"
        });
    } catch (error) {
        /* Return an error message if any exception occurs during Department editing */
        return res.status(404).json({
            message: "Unable to update the state"
        })
    }
}

const deleteState = async (req, res) => {
    try {
        /* Extract the State ID from the request body */
        const {
            id
        } = req.body;
        /* Check if the provided State ID exists in the State model */
        const existingStateID = await State.findOne({
            where: {
                id: id,
                status: {
					[Op.ne]: State.STATUS_DELETED
				}
            }
        });
        if (!existingStateID) {
            return res.status(404).json({
                message: 'State not found.'
            });
        }
        /* Call the deleteStateByID method to perform the State deletion */
        const isDeleted = await State.deleteStateByID(id, req.user_detail);
        if (!isDeleted) {
            return res.status(500).json({
                message: 'Unable to delete the state'
            });
        }
        /* Return a success message if the State deletion is successful  */
        return res.status(200).json({
            message: "State has been deleted"
        });
    } catch (error) {
        logger.error(error);
        /* Return an error message if any exception occurs during State deletion */
        return res.status(500).json({
            message: "Unable to delete the state"
        })
    }
}

module.exports = {
    statelist,
    addState,
    singleState,
    updateState,
    deleteState
}