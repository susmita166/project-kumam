const Module = require("../../../models/Module");
const RbacAction = require("../../../models/RbacAction");
const arrayHelper = require("../../../../helpers/array");

const allModules = async (req, res) => {
    let modules = await Module.fetchAllModules();
    const rbacActions = await RbacAction.fetchAllRbacActions();
    let rbacActionsMappedByID = [];
    rbacActions.forEach(item => {
        rbacActionsMappedByID[item.id] = item;
    })
    modules = modules.map((item) => {
        const moduleActionIDs = item.action_ids ? item.action_ids.split(',') : [];
        const actionIDsOfModule = moduleActionIDs.map((actionItem) => ({
            action_id: actionItem,
            action_name: rbacActionsMappedByID[actionItem] ? rbacActionsMappedByID[actionItem].name : null
        }));
        return {
            ...item.dataValues,
            action_ids_detail: actionIDsOfModule
        };
    });
    return res.json({
        count: modules.length,
        data: modules
    });
}

const addModule = async (req, res) => {
    const moduleDetail = await Module.fetchModuleDetailsByName(req.body.name);
    if (moduleDetail) {
        return res.status(409).json({
            message: 'Module with same name exists.'
        });
    }
    const actionIDs = arrayHelper.removeDuplicatesAndSort(req.body.action_ids);
    const actionIDsDetails = await RbacAction.fetchMultipleRbacActionDetailsByIDs(actionIDs);
    if (actionIDs.length !== actionIDsDetails.length) {
        return res.status(422).json({
            message: 'Invalid action IDs detected.'
        });
    }
    const isAdded = await Module.addModule(req.body.name, req.body.description, actionIDs, req.body.status, req.user_detail);
    if (!isAdded) {
        return res.status(500).json({
            message: 'Unable to add module.'
        });
    }
    return res.json({
        message: 'Module has been added.'
    });
}

const moduleDetail = async (req, res) => {
    const moduleDetail = await Module.fetchModuleDetailsByID(req.query.id);
    const rbacActions = await RbacAction.fetchAllRbacActions();
    let rbacActionsMappedByID = [];
    rbacActions.forEach(item => {
        rbacActionsMappedByID[item.id] = item;
    })
    if (moduleDetail) {
        const moduleActionIDs = (moduleDetail.action_ids || '').split(',');
        const actionIDsOfModule = moduleActionIDs.map((actionItem) => ({
            action_id: actionItem,
            action_name: rbacActionsMappedByID[actionItem] ? rbacActionsMappedByID[actionItem].name : null
        }));
        moduleDetail.dataValues && (moduleDetail.dataValues.action_ids_detail = actionIDsOfModule);
    }
    return res.json({
        data: moduleDetail
    });
}

const editModule = async (req, res) => {
    const moduleDetail = await Module.fetchModuleDetailsByID(req.body.id);
    if (!moduleDetail) {
        return res.status(404).json({
            message: 'Module not found.'
        });
    }
    const actionIDs = arrayHelper.removeDuplicatesAndSort(req.body.action_ids);
    const actionIDsDetails = await RbacAction.fetchMultipleRbacActionDetailsByIDs(actionIDs);
    if (actionIDs.length !== actionIDsDetails.length) {
        return res.status(422).json({
            message: 'Invalid action IDs detected.'
        });
    }
    const isUpdated = await Module.editModule(req.body.id, req.body.name, req.body.description, actionIDs, req.body.status, req.user_detail);
    if (!isUpdated) {
        return res.status(500).json({
            message: 'Unable to update the module.'
        });
    }
    return res.json({
        message: 'Module has been updated.'
    });
}

module.exports = {
    allModules: allModules,
    addModule: addModule,
    moduleDetail: moduleDetail,
    editModule: editModule
}