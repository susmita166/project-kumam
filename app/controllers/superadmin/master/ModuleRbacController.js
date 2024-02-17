const UserRole = require("../../../models/UserRole");
const Module = require("../../../models/Module");
const RbacAction = require("../../../models/RbacAction");
const arrayHelper = require("../../../../helpers/array");
const ModuleRbac = require("../../../models/ModuleRbac");
const ModuleRbacLog = require("../../../models/ModuleRbacLog");

const allModuleRbac = async (req, res) => {
    const roleID = req.query.role_id;
    const userRoleModel = new UserRole();
    const roleDetail = await userRoleModel.fetchRoleDetailByID(roleID);
    if (!roleDetail) {
        return res.status(404).json({
            message: 'User role not found.'
        });
    }
    let modulesRbacList = await ModuleRbac.fetchAllModuleRbacsByRoleID(roleID);
    const modules = await Module.fetchAllModules();
    const modulesMappedByID = [];
    modules.forEach(item => {
        modulesMappedByID[item.id] = item;
    });
    const rbacActions = await RbacAction.fetchAllRbacActions();
    let rbacActionsMappedByID = [];
    rbacActions.forEach(item => {
        rbacActionsMappedByID[item.id] = item;
    });
    modulesRbacList = modulesRbacList.map((item) => {
        const module_id = item.module_id;
        const module = modulesMappedByID[module_id] || {
            name: null
        };
        const permittedActionIDs = item.permitted_action_ids ? item.permitted_action_ids.split(',') : [];
        const permittedActionDetails = permittedActionIDs.map((actionItem) => ({
            action_id: actionItem,
            action_name: rbacActionsMappedByID[actionItem] ? rbacActionsMappedByID[actionItem].name : null
        }));
        return {
            ...item.dataValues,
            role_name: roleDetail.name,
            module_name: module.name,
            permitted_action_ids_detail: permittedActionDetails
        };
    });
    return res.json({
        count: modulesRbacList.length,
        data: modulesRbacList
    });
}

const manageModuleRbac = async (req, res) => {
    const roleID = req.body.role_id;
    const userRoleModel = new UserRole();
    const roleDetail = await userRoleModel.fetchRoleDetailByID(roleID);
    if (!roleDetail) {
        return res.status(404).json({
            message: 'User role not found.'
        });
    }
    const accessControlList = req.body.access_control;
    const moduleIDList = accessControlList.map(item => item.module_id);
    const moduleListDetail = await Module.fetchMultipleModuleDetailsByIDs(moduleIDList);
    if (moduleIDList.length !== moduleListDetail.length) {
        return res.status(422).json({
            message: 'Invalid module ID detected.'
        });
    }
    const actionIDList = arrayHelper.removeDuplicatesAndSort([].concat(...accessControlList.map(item => item.action_ids)));
    const actionListDetail = await RbacAction.fetchMultipleRbacActionDetailsByIDs(actionIDList);
    if (actionIDList.length !== actionListDetail.length) {
        return res.status(422).json({
            message: 'Invalid action ID detected.'
        });
    }
    const userRoleBasedModules = await ModuleRbac.fetchAllModuleRbacsByRoleID(roleID);
    const rbacMappedByRoleIDAndMdoduleID = userRoleBasedModules.reduce((map, item) => {
        map.set(item.role_id + '_' + item.module_id, item);
        return map;
    }, new Map());

    const existingRoleIDWithModuleID = Array.from(rbacMappedByRoleIDAndMdoduleID.keys());
    const newRoleIDWithModuleID = [];
    accessControlList.forEach(item => {
        newRoleIDWithModuleID.push(roleID + '_' + item.module_id);
    });

    const missingModulesInNewList = existingRoleIDWithModuleID.filter(item => !newRoleIDWithModuleID.includes(item));

    missingModulesInNewList.forEach(item => {
        const data = item.split('_');
        const moduleID = data[1];
        const roleID = data[0];
        ModuleRbac.deactivateModuleForUserRole(moduleID, roleID, req.user_detail);
    });

    const promises = accessControlList.map(item => {
        const reqModuleID = item.module_id;
        const actionIDList = arrayHelper.removeDuplicatesAndSort(item.action_ids);
        const roleModuleKey = roleID + '_' + reqModuleID;
        if (rbacMappedByRoleIDAndMdoduleID.has(roleModuleKey)) {
            return ModuleRbac.editModuleRbac(roleID, reqModuleID, actionIDList, req.user_detail);
        } else {
            return ModuleRbac.addModuleRbac(roleID, reqModuleID, actionIDList, req.user_detail);
        }
    });
    Promise.all(promises);
    ModuleRbacLog.addModuleRbacLog(roleID, accessControlList, req.user_detail);
    return res.json({
        message: 'Permissions of modules have been updated for the user role.'
    });
}

module.exports = {
    allModuleRbac: allModuleRbac,
    manageModuleRbac: manageModuleRbac
}