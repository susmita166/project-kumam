const moment = require('moment');
const PersonalAccessToken = require('../app/models/PersonalAccessToken');
const User = require('../app/models/User');

const isAuthenticated = async (req, res, next) => {
    /**
     * Get the token from the request header.
     */
    let token = req.get('Authorization')?.trim();
    /**
     * Check if the token is present or not.
     */
    if (!token) {
        return res.status(401).json({
            message: `Unauthorized`
        });
    }
    if (token.startsWith('Bearer ')) {
        token = token.substring(7);
    }
    /**
     * Get the token details.
     */
    const personalAccessTokenModel = new PersonalAccessToken();
    const tokenDetail = await personalAccessTokenModel.findSuperAdminTokenDetail(token);
    if (!tokenDetail) {
        return res.status(401).json({
            message: `Unauthorized`
        });
    }
    /**
     * Update the token last used time.
     */
    personalAccessTokenModel.updateTokenLastUsedTime(tokenDetail.id);
    /**
     * Check if the token has expired.
     */
    const secondsRemaining = moment(new Date(tokenDetail.expires_at)).diff(new Date(), 'seconds');
    if (secondsRemaining <= 0) {
        return res.status(401).json({
            message: `Token has expired`
        });
    }
    /**
     * Get the user details.
     */
    const userModel = new User();
    const userDetail = await userModel.fetchUserDetailByID(tokenDetail.user_id);
    if (!userDetail) {
        return res.status(401).json({
            message: `Unauthorized`
        });
    }
    /**
     * Add the superadmin details to the req.
     */
    req.user_detail = userDetail;
    req.token_detail = tokenDetail;
    /**
     * Continue with the request.
     */
    return next();
}

module.exports = {
    isAuthenticated
}