const RbacAction = require("../../../models/RbacAction");

const allActions = async (req, res) => {
    const actions = await RbacAction.fetchAllRbacActions();
    return res.json({
        count: actions.length,
        data: actions
    });
}

module.exports = {
    allActions: allActions
}