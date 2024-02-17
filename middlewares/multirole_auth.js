const moment = require('moment');
const PersonalAccessToken = require('../app/models/PersonalAccessToken');
const User = require('../app/models/User');
const UserRole = require('../app/models/UserRole');
const Department = require('../app/models/Department');

const isAuthenticated = async (req, res, next) => {
    let token = req.get('Authorization')?.trim();
    if (!token) {
        return res.status(401).json({
            message: `Unauthorized Invalid token format`
        });
    }
    if (token.startsWith('Bearer')) {
        token = token.substring(7);
    }
    const personalAccessTokenModel = new PersonalAccessToken();
    const tokenDetail = await personalAccessTokenModel.findUserTokenDetail(token);
 
    if (!tokenDetail) {
        return res.status(401).json({ message: `Unauthorized` });
    }
    
    personalAccessTokenModel.updateTokenLastUsedTime(tokenDetail.id);
    const secondsRemaining = moment(new Date(tokenDetail.expires_at)).diff(new Date(), 'seconds');
    if (secondsRemaining <= 0) {
        return res.status(401).json({
            message: `Token has expired`
        });
    }
    const userModel = new User();
    const userDetail = await userModel.fetchUserDetailByID(tokenDetail.user_id);
    if (!userDetail) {
        return res.status(401).json({
            message: `Unauthorized User not found`
        });
    }

    const userRoleModel = new UserRole();
    const roleDetail = await userRoleModel.fetchRoleDetailByID(userDetail.role_id);
    if (!roleDetail) {
        return res.status(401).json({
            message: 'Associated user role not found.'
        });
    }
    userDetail.department_id = roleDetail.department_id;
    const departmentDetail = await Department.fetchDepartmentDetailsByID(roleDetail.department_id);
    if (!departmentDetail) {
        return res.status(401).json({
            message: 'Associated department not found.'
        });
    }
    req.user_detail = userDetail;
    req.token_detail = tokenDetail;
    req.role_detail = roleDetail;
    req.department_detail = departmentDetail;
    return next();
}

module.exports = {
    isAuthenticated
}