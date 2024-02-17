const ModuleRbac = require("../app/models/ModuleRbac");
const UserRole = require("../app/models/UserRole");

const canAccess = (moduleID, actionID) => {
    return async (req, res, next) => {
        const roleID = req.user_detail.role_id;
        if (roleID == UserRole.ROLE_SUPER_ADMIN) {
            return next();
        }
        const modulesAllocatedToUserRole = await ModuleRbac.fetchAllModuleRbacsByRoleID(roleID);
        const allowedModules = {};
        modulesAllocatedToUserRole.forEach(item => {
            allowedModules[item.module_id] = (item.permitted_action_ids) ? item.permitted_action_ids.split(',') : [];
        });
        const allowedModulesIDs = Object.keys(allowedModules);
        if (!allowedModulesIDs.includes(moduleID)) {
            return res.status(401).json({
                message: `Module access not permitted.`
            });
        }
        if (!allowedModules[moduleID].includes(actionID)) {
            return res.status(401).json({
                message: `Action not permitted.`
            });
        }
        return next();
    }
}

module.exports = {
    canAccess
}