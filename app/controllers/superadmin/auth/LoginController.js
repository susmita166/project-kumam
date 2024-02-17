const useragent = require('useragent');
const User = require('../../../models/User');
const PersonalAccessToken = require('../../../models/PersonalAccessToken');
const logger = require('../../../../util/logger');

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
    const userDetail = await userModel.findUserByEmailAddress(email);
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
    /**
     * Generate an access token.
     */
    const personalAccessTokenModel = new PersonalAccessToken();
    const {token, expiryDate} = await personalAccessTokenModel.generateTokenForSuperAdmin(userDetail, userAgent, clientIPAddress);
    /**
     * Return success response.
     */
    return res.json({
        message: 'Login successful.',
        token: token,
        expries_at: expiryDate,
        user: {
            name: (`${userDetail.first_name} ${userDetail.last_name}`).trim(),
            email: userDetail.email,
            created_at: userDetail.created_at
        }
    });
}

const validateToken = async (req, res) => {
    const userDetail = req.user_detail;
    const tokenDetail = req.token_detail;
    /**
     * Return success response.
     */
    return res.json({
        message: 'Token is valid.',
        user: {
            name: (`${userDetail.first_name} ${userDetail.last_name}`).trim(),
            email: userDetail.email,
            created_at: userDetail.created_at
        },
        expires_at: tokenDetail.expires_at
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
    const tokenDetail = await personalAccessTokenModel.findSuperAdminTokenDetail(token);
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
    authenticate,
    validateToken,
    logout
}