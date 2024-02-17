const User = require('../../../models/User');
const stringHelper = require('../../../../helpers/string');

const createAccount = async (req, res) => {
    /**
     * Check if the request body is empty.
     */
    if (Object.keys(req.body).length === 0) {
        return res.status(500).json({
            message: 'Please fill in the required fields.'
        });
    }
    /**
     * Get the request data.
     */
    const name = (stringHelper.removeHtmlTags(req.body.name)).trim();
    const email = (stringHelper.removeHtmlTags(req.body.email)).trim();
    const password = req.body.password.trim();
    const passwordConfirm = req.body.password_confirm.trim();
    /**
     * Check if the password and password confirm matches or not.
     */
    if (password !== passwordConfirm) {
        return res.status(422).json({
            message: `Passwords don't match`
        });
    }
    /**
     * Create the user.
     */
    const userModel = new User();
    const totalSuperAdminUsers = await userModel.countSuperAdminUsers();
    if (totalSuperAdminUsers > 0) {
        return res.status(403).json({
            message: 'Only 1 super admin account can be created. Please contact support for assistance.'
        });
    }
    /**
     * Check if the email address has been taken or not.
     */
    let userDetail = await userModel.findUserByEmailAddress(email);
    if (userDetail) {
        return res.status(500).json({
            message: `Email already taken. Please use another email.`,
        });
    }
    /**
     * Create the user account.
     */
    const createUser = await userModel.createSuperadminUser(name, email, password);
    if (!createUser) {
        return res.status(500).json({
            message: 'Unable to create the account.'
        });
    }
    return res.json({
        message: 'Account has been created.'
    });
}

module.exports = {
    createAccount
}