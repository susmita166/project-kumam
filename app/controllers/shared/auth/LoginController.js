const useragent = require('useragent');
const User = require('../../../models/User');
const PersonalAccessToken = require('../../../models/PersonalAccessToken');
const logger = require('../../../../util/logger');
const appConfig = require('../../../../config/app');
const UserRole = require('../../../models/UserRole');
const Department = require('../../../models/Department');

const authenticate = async (req, res) => {
    /**
     * Get the request data.
     */
    const email = req.body.email.trim();
    const password = req.body.password.trim();
    /**
     * Get the device information.
     */
    let userAgent = null;
    try {
        if (req.get('User-Agent')) {
            const userAgentData = useragent.parse(req.get('User-Agent'));
            userAgent = userAgentData.toJSON();
            userAgent.actual_agent = req.get('User-Agent');
        }
    } catch (err) {
        logger.error("Unable to parse the user agent data during login.");
        logger.error(err);
        return res.status(500).json({
            message: `Unable to verify the device.`
        });
    }
    const clientIPAddress = (req.get('Client-Original-IP')) ? req.get('Client-Original-IP') : null;
    /**
     * Find the user detail.
     */
    const userModel = new User();
    const userDetail = await userModel.findActiveUserByEmailAddress(email);
    if (!userDetail) {
        return res.status(422).json({
            message: `Invalid email or password.`
        });
    }
    /**
     * Check the password hash.
     */
    const isPasswordHashValid = await userModel.isPasswordHashValid(userDetail.password, password);
    if (!isPasswordHashValid) {
        return res.status(401).json({
            message: `Invalid email or password.`
        });
    }
    const userRoleModel = new UserRole();
    const roleDetail = await userRoleModel.fetchRoleDetailByID(userDetail.role_id);
    if (!roleDetail) {
        return res.status(404).json({
            message: 'Associated user role not found'
        });
    }
    const departmentDetail = await Department.fetchDepartmentDetailsByID(roleDetail.department_id);
    if (!departmentDetail) {
        return res.status(500).json({
            message: 'Associated department not found'
        });
    }
    /**
     * Generate an access token.
     */
    const personalAccessTokenModel = new PersonalAccessToken();
    const {token, expiryDate} = await personalAccessTokenModel.generateTokenForUser(userDetail, userAgent, departmentDetail.id, clientIPAddress);
    /**
     * Return success response.
     */
    return res.json({
        message: 'Login successful.',
        token: token,
        expries_at: expiryDate,
        user: {
            name: userDetail.name,
            email: userDetail.email,
            created_at: userDetail.created_at,
            role_id: (roleDetail) ? roleDetail.id : 0,
            role_name: (roleDetail) ? roleDetail.role_name : null,
            department_id: (departmentDetail) ? departmentDetail.id : 0,
            department_name: (departmentDetail) ? departmentDetail.name : null
        }
    });
}

const validateToken = async (req, res) => {
    /**
     * Return success response.
     */
    return res.json({
        message: 'Token is valid.',
        user: {
            name: (req.user_detail) ? (req.user_detail.first_name + ' ' + req.user_detail.last_name)?.trim() : null,
            email: (req.user_detail) ? req.user_detail.email : null,
            created_at: (req.user_detail) ? req.user_detail.created_at : null,
            role_id: (req.role_detail) ? req.role_detail.id : 0,
            role_name: (req.role_detail) ? req.role_detail.role_name : null,
            department_id: (req.department_detail) ? req.department_detail.id : 0,
            department_name: (req.department_detail) ? req.department_detail.name : null
        },
        expires_at: (req.token_detail) ? req.token_detail.expires_at : null
    });
}

const logout = async (req, res) => {
    /**
     * Get the token.
     */
    const token = req.get('Authorization').trim();
    /**
     * Find the token details from the database.
     */
    const personalAccessTokenModel = new PersonalAccessToken();
    const tokenDetail = await personalAccessTokenModel.findUserTokenDetail(token);
    /**
     * Check if the token exists or not.
     */
    if (!tokenDetail) {
        return res.status(401).json({
            message: `Invalid token.`
        });
    }
    /**
     * Archive the token.
     */
    const isArchived = await personalAccessTokenModel.archiveToken(req.user_detail, token);
    if (!isArchived) {
        return res.status(500).json({
            message: `Unable to logout the user.`
        });
    }
    return res.json({
        message: `User has been logged out.`
    });
}

module.exports = {
    authenticate: authenticate,
    validateToken: validateToken,
    logout: logout
}