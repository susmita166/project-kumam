const PersonalAccessToken = require('../../models/PersonalAccessToken');
const User = require('../../models/User');
const stringHelper = require('../../../helpers/string');

const updatePassword = async (req, res) => {
    /**
     * Get the request data.
     */
    const oldPassword = req.body.old_password.trim();
    const newPassword = req.body.new_password.trim();
    const confirmNewPassword = req.body.new_password_confirm.trim();
    /**
     * Check if the new passwords match.
     */
    if (newPassword !== confirmNewPassword) {
        return res.status(422).json({
            message: `New passwords don't match.`
        });
    }
    /**
     * Check if the old password is correct.
     */
    const userModel = new User();
    const isPasswordHashValid = await userModel.isPasswordHashValid(req.user_detail.password, oldPassword);
    if (!isPasswordHashValid) {
        return res.status(422).json({
            message: `Invalid old password.`
        });
    }
    /**
     * Change the account password.
     */
    const isChanged = await userModel.changeAccountPassword(req.user_detail.id, newPassword);
    if (!isChanged) {
        return res.status(500).json({
            message: `Unable to change the account password.`
        });
    }
    return res.json({
        message: `Account password has been changed.`
    });
}

const activeDevices = async (req, res) => {
    /**
     * Get the list of logged-in devices.
     */
    const userID = req.user_detail.id;
    const personalAccessTokenModel = new PersonalAccessToken();
    const devices = await personalAccessTokenModel.findLoggedInDevicesByUserID(userID, req.token_detail.id);
    /**
     * Return the success response.
     */
    return res.json({
        count: devices.length,
        data: devices
    });
}

const removeDevice = async (req, res) => {
    /**
     * Get the request data.
     */
    const userID = req.user_detail.id;
    const tokenID = req.body.token_id;
    /**
     * Check if the token belongs to the user.
     */
    const personalAccessTokenModel = new PersonalAccessToken();
    const tokenDetail = await personalAccessTokenModel.findTokenDetailByTokenIDAndUserID(userID, tokenID);
    if (!tokenDetail) {
        return res.status(403).json({
            message: `You are not allowed to remove this device.`
        });
    }
    /**
     * Remove the device.
     */
    const isRemoved = await personalAccessTokenModel.archiveToken(req.user_detail, tokenDetail.token);
    if (!isRemoved) {
        return res.status(500).json({
            message: `Unable to logout the device.`
        });
    }
    return res.json({
        message: `Device has been logged-out.`
    });
}

module.exports = {
    updatePassword,
    activeDevices,
    removeDevice
};