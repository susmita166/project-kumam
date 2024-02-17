const User = require("../../models/User");
const UserRole = require("../../models/UserRole");
const Department = require('../../models/Department');
const UrbanLocalBody = require("../../models/UrbanLocalBody");
const UserToULB = require("../../models/UserToULB");

const addUser = async (req, res) => {
    if (req.body.password.trim() !== req.body.password_confirm.trim()) {
        return res.status(422).json({
            message: `Passwords don't match.`
        });
    }
    if (req.body.ulb_id && req.body.ulb_id > 0) {
        const ulbDetail = await UrbanLocalBody.fetchUrbanLocalBodyDetailsByID(req.body.ulb_id);
        if (!ulbDetail) {
            return res.status(404).json({
                message: 'Urban local body not found.'
            });
        }
    }
    const userRoleModel = new UserRole();
    const roleDetail = await userRoleModel.fetchRoleDetailByID(req.body.role_id, true);
    if (!roleDetail) {
        return res.status(404).json({
            message: 'User role not found.'
        });
    }
    /**
     * Create a new instance of the User model
     */
    const userModel = new User();
    const userDetailByEmail = await userModel.findUserByEmailAddress(req.body.email);
    if (userDetailByEmail) {
        return res.status(401).json({
            message: 'This email is already taken. Please use another email address.'
        });
    }
    const userDetailByUsername = await userModel.findUserByUsername(req.body.username);
    if (userDetailByUsername) {
        return res.status(401).json({
            message: 'This username is already taken. Please use another username.'
        });
    }
    const isValidRoleInDepartment = await UserRole.findOne({
        where: {
            id: req.body.role_id,
            department_id: req.body.department_id
        }
    });
    if (!isValidRoleInDepartment) {
        return res.status(401).json({
            message: 'The provided user role does not correspond to the specified department. Please ensure that the user role matches the department it is intended for.'
        });
    }
    /**
     * Create a new user with the provided information and user details
     */
    const user = await userModel.createUser(req.body.role_id, req.body.first_name, req.body.last_name, req.body.email, req.body.username, req.body.password, req.user_detail);
    /**
     * Check if the user creation was successful, if not, return a 500 status with an error message
     */
    if (!user) {
        return res.status(500).json({
            message: 'Unable to add the user.'
        });
    }
    /**
     * Link the user to the ULB.
     */
    if (req.body.ulb_id && req.body.ulb_id > 0) {
        const linkUserToUlb = await UserToULB.addUserToUlb(user.id, req.body.ulb_id, req.user_detail);
        if (!linkUserToUlb) {
            return res.status(500).json({
                message: 'Unable to link user to the ULB'
            });
        }
    }
    /**
     * Return a JSON response with a success message
     */
    return res.json({
        message: 'User has been added.'
    });
}

const allUsers = async (req, res) => {
    /**
     * Create a new instance of the User model
     */
    const userModel = new User();
    /**
     * Fetch all users from the database and store the result in the users variable
     */
    const users = await userModel.fetchAllUsers(req.user_detail, true);
    /**
     * Create a new instance of the UserRole model
     */
    const userRoleModel = new UserRole();
    /**
     * Fetch all user roles from the database and store the result in the roles variable
     */
    const roles = await userRoleModel.fetchAllRoles(req.user_detail, true);
    const department = await Department.fetchAllDepartments()
    const departmentsMappedByID = department.reduce((acc, curr) => {
        acc[curr.id] = curr.name;
        return acc;
    }, {});
    const rolesMappedByID = roles.reduce((acc, curr) => {
        acc[curr.id] = curr;
        return acc;
    }, {});
    const usersLength = users.length;
    for (let index = 0; index < usersLength; index++) {
        const currentItem = users[index];
        const roleId = currentItem.role_id;
        const role = rolesMappedByID[roleId];
        const departmentName = role && role.department_id ? (departmentsMappedByID[role.department_id] && departmentsMappedByID[role.department_id].department_name) : null;
        users[index].dataValues.role_name = role ? role.role_name : null;
        users[index].dataValues.department_name = departmentName;
    }
    /**
     * Return a JSON response with the count of users and the data itself
     */
    return res.json({
        count: users.length,
        data: users
    });
}

const getUserDetail = async (req, res) => {
    /**
     * Create a new instance of the User model
     */
    const userModel = new User();
    /**
     * Fetch the user detail by ID using the userModel
     */
    const userDetail = await userModel.fetchUserDetailByID(req.query.user_id, true);
    /**
     * If user Detail is falsy, return a 404 status with a JSON object containing a message
     */
    if (!userDetail) {
        return res.status(404).json({
            message: 'User not found.'
        });
    }
    const userULBData = await UserToULB.fetchUlbMappedToUser(userDetail.id);
    if (userULBData) {
        userDetail.dataValues.ulb_id = userULBData.ulb_id;
        userDetail.dataValues.ulb_name = null;
        if (userULBData.ulb_id) {
            const ulbDetail = await UrbanLocalBody.fetchUrbanLocalBodyDetailsByID(userULBData.ulb_id);
            if (ulbDetail) {
                userDetail.dataValues.ulb_name = ulbDetail.name;
            }
        }
    } else {
        userDetail.dataValues.ulb_id = 0;
    }
    const userRoleModel = new UserRole();
    const roleDetail = await userRoleModel.fetchRoleDetailByID(userDetail.role_id);
    if (roleDetail) {
        userDetail.dataValues.department_id = roleDetail.department_id;
        userDetail.dataValues.department_name = null;
        if (roleDetail.department_id) {
            const departmentDetail = await Department.fetchDepartmentDetailsByID(roleDetail.department_id);
            if (departmentDetail) {
                userDetail.dataValues.department_name = departmentDetail.name;
            }
        }
    } else {
        userDetail.dataValues.department_id = 0;
        userDetail.dataValues.department_name = null;
    }
    /**
     * Return a JSON object containing the user detail
     */
    return res.json({
        data: userDetail
    });
}

const editUser = async (req, res) => {
    /**
     * Create a new instance of the User model
     */
    const userModel = new User();
    if (req.body.ulb_id && req.body.ulb_id > 0) {
        const ulbDetail = await UrbanLocalBody.fetchUrbanLocalBodyDetailsByID(req.body.ulb_id);
        if (!ulbDetail) {
            return res.status(404).json({
                message: 'Urban local body not found.'
            });
        }
    }
    /**
     * Fetch the user detail from the database based on the provided user ID and user details
     */
    const userDetail = await userModel.fetchUserDetailByID(req.body.user_id, true);
    /**
     * Check if the user detail is not found, return a 404 status with an error message
     */
    if (!userDetail) {
        return res.status(404).json({
            message: 'User not found.'
        });
    }
    /**
     * Create a new instance of the UserRole model
     */
    const userRoleModel = new UserRole();
    /**
     * Fetch the userRole detail from the database based on the provided role ID and user details
     */
    const roleDetail = await userRoleModel.fetchRoleDetailByID(req.body.role_id, true);
    /**
     * Check if the userRole detail is not found, return a 404 status with an error message
     */
    if (!roleDetail) {
        return res.status(404).json({
            message: 'User role not found.'
        });
    }
    const userDetailByEmail = await userModel.findUserByEmailAddress(req.body.email);
    if (userDetailByEmail && userDetailByEmail.id !== req.body.user_id) {
        return res.status(401).json({
            message: 'This email is already taken. Please use another email address.'
        });
    }
    const userDetailByUsername = await userModel.findUserByUsername(req.body.username);
    if (userDetailByUsername && userDetailByUsername.id !== req.body.user_id) {
        return res.status(401).json({
            message: 'This username is already taken. Please use another username.'
        });
    }
    const isValidRoleInDepartment = await UserRole.findOne({
        where: {
            id: req.body.role_id,
            department_id: req.body.department_id
        }
    });
    if (!isValidRoleInDepartment) {
        return res.status(401).json({
            message: 'The provided user role does not correspond to the specified department. Please ensure that the user role matches the department it is intended for.'
        });
    }
    /**
     * Update the user details with the provided information and user details
     */
    const isUserUpdated = await userModel.updateUser(req.body.user_id, req.body.role_id, req.body.first_name, req.body.last_name, req.body.email, req.body.username, req.body.password, req.body.status, req.user_detail);
    /**
     * Check if the user update was successful, if not, return a 500 status with an error message
     */
    if (!isUserUpdated) {
        return res.status(500).json({
            message: 'Unable to update the user.'
        });
    }
    /***
     * Return a JSON response with a success message
     */
    return res.json({
        message: 'User has been updated.'
    });
}

const deleteUser = async (req, res) => {
    /**
     * Create a new instance of the User model
     */
    const userModel = new User();
    /**
     * Fetch the user detail by ID using the userModel
     */
    const userDetail = await userModel.fetchUserDetailByID(req.body.user_id, true);
    /**
     * If user Detail is falsy, return a 404 status with a JSON object containing a message
     */
    if (!userDetail) {
        return res.status(404).json({
            message: 'User not found.'
        });
    }
    /**
     * Delete the user using the userModel and store the result in isDeleted variable
     */
    const isDeleted = await userModel.deleteUserByID(req.body.user_id, req.user_detail);
    /**
     * If isDeleted is falsy, return a 500 status with a JSON object containing a message
     */
    if (!isDeleted) {
        return res.status(500).json({
            message: 'Unable to delete the user.'
        });
    }
    /***
     * Return a JSON response with a success message indicating the user has been deleted
     */
    return res.json({
        message: 'User has been deleted.'
    });
}

module.exports = {
    addUser,
    allUsers,
    getUserDetail,
    editUser,
    deleteUser
};