const {
    Sequelize,
    DataTypes,
    Model,
    Op
} = require("sequelize");
const Department = require('../models/Department')
const sequelize = require("../../util/database");
const logger = require('../../util/logger');
const moment = require('moment');
const argon2 = require('argon2');
const securityConfig = require('../../config/security');
const UserRole = require("./UserRole");
const slugify = require('slug');

class User extends Model {

    STATUS_DELETED = "0";
    STATUS_ACTIVE = "1";
    STATUS_INACTIVE = "2";

    allFields = ['id', 'created_by', 'created_at', 'updated_by', 'updated_at', 'status', 'role_id','first_name', 'last_name', 'email', 'username', 'password'];
    selectiveFields = ['id', 'created_at', 'updated_at', 'status', 'role_id', 'first_name', 'last_name', 'email', 'username'];

    async findUserByEmailAddress(email) {
        return await User.findOne({
            where: {
                email: email,
                status: {
                    [Op.ne]: this.STATUS_DELETED
                }
            }
        });
    }

    async findUserByUsername(username) {
        return await User.findOne({
            where: {
                username: username,
                status: {
                    [Op.ne]: this.STATUS_DELETED
                }
            }
        });
    }

    async createSuperadminUser(name, email, password) {
        /**
         * Hash the plain-text password.
         */
        let passwordHash = "";
        try {
            passwordHash = await argon2.hash(password, {
                hashLength: securityConfig.password_hashing_algorithm.argon2.hash_length, 
                timeCost: securityConfig.password_hashing_algorithm.argon2.time_cost,
                memoryCost: securityConfig.password_hashing_algorithm.argon2.memory_cost,
                parallelism: securityConfig.password_hashing_algorithm.argon2.paralellism,
                type: argon2.argon2id
            });
            if (passwordHash.trim() === "") {
                logger.error("Password hash is empty");
                return false;
            }
        } catch (err) {
            logger.error("Unable to hash the password.");
            logger.error(err);
            return false;
        }
        /**
         * Insert the record.
         */
        const currentDate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        try {
            return await User.create({
                created_by: 1,
                created_at: currentDate,
                updated_by: 1,
                updated_at: currentDate,
                status: this.STATUS_ACTIVE,
                role_id: UserRole.ROLE_SUPER_ADMIN,
                first_name: name,
                last_name: " ",
                username: slugify(name, {
                    replacement: "_"
                }),
                email: email,
                password: passwordHash
            }).then(data => {
                return true;
            }).catch(err => {
                logger.error("Unable to create the super admin user");
                logger.error(err);
                return false;
            });
        } catch (err) {
            logger.error("Unable to create the super admin user");
            logger.error(err);
            return false;
        }
    }

    async createUser(roleID, firstName, lastName, email, username, password, userDetail) {
        let passwordHash = "";
        try {
            passwordHash = await argon2.hash(password, {
                hashLength: securityConfig.password_hashing_algorithm.argon2.hash_length,
                timeCost: securityConfig.password_hashing_algorithm.argon2.time_cost,
                memoryCost: securityConfig.password_hashing_algorithm.argon2.memory_cost,
                parallelism: securityConfig.password_hashing_algorithm.argon2.paralellism,
                type: argon2.argon2id
            });
            if (passwordHash.trim() === "") {
                logger.error("Password hash is empty");
                return false;
            }
        } catch (err) {
            logger.error("Unable to hash the password.");
            logger.error(err);
            return false;
        }
        const currentDate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        return await User.create({
            created_by: userDetail.id,
            created_at: currentDate,
            updated_by: userDetail.id,
            updated_at: currentDate,
            status: this.STATUS_ACTIVE,
            role_id: roleID,
            first_name: firstName,
            last_name: lastName,
            username: username,
            email: email,
            password: passwordHash
        }).then(data => {
            return data;
        }).catch(err => {
            logger.error("Unable to create user");
            logger.error(err);
            return false;
        });
    }

    async fetchAllUsers(userDetail, getSelectiveFields = false) {
        return await User.findAll({
            attributes: (getSelectiveFields) ? this.selectiveFields : this.allFields,
            where: {
                created_by: userDetail.id,
                status: {
                    [Op.ne]: this.STATUS_DELETED
                }
            }
        });
    }

    async fetchAllDepartment() {
        return await Department.findAll({
            where: {
                status: {
                    [Op.ne]: this.STATUS_DELETED
                }
            },
        })
    }

    async fetchUserDetailByID(userID, getSelectiveFields = false) {
        return await User.findOne({
            attributes: (getSelectiveFields) ? this.selectiveFields : this.allFields,
            where: {
                id: userID,
                status: {
                    [Op.ne]: this.STATUS_DELETED
                }
            }
        });
    }

    async updateUser(userID, roleID, firstName, lastName, email, username, password, status, userDetail) {
        let passwordHash = "";
        if (password && password.length > 0) {
            try {
                passwordHash = await argon2.hash(password, {
                    hashLength: securityConfig.password_hashing_algorithm.argon2.hash_length,
                    timeCost: securityConfig.password_hashing_algorithm.argon2.time_cost,
                    memoryCost: securityConfig.password_hashing_algorithm.argon2.memory_cost,
                    parallelism: securityConfig.password_hashing_algorithm.argon2.paralellism,
                    type: argon2.argon2id
                });
                if (passwordHash.trim() === "") {
                    logger.error("Password hash is empty");
                    return false;
                }
            } catch (err) {
                logger.error("Unable to hash the password.");
                logger.error(err);
                return false;
            }
        }
        const currentDate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        let dataToUpdate = {
            updated_by: userDetail.id,
            updated_at: currentDate,
            status: (status && status === '1') ? this.STATUS_ACTIVE : this.STATUS_INACTIVE,
            role_id: roleID,
            first_name: firstName,
            last_name: lastName,
            username: username,
            email: email,
        };
        if (passwordHash && passwordHash.length > 0) {
            dataToUpdate.password = passwordHash;
        }
        return await User.update(dataToUpdate, {
            where: {
                id: userID,
                created_by: userDetail.id,
                status: {
                    [Op.ne]: this.STATUS_DELETED
                }
            }
        }).then(data => {
            return true;
        }).catch(err => {
            logger.error("Unable to update user");
            logger.error(err);
            return false;
        });
    }

    async deleteUserByID(userID, userDetail) {
        const currentDate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        return await User.update({
            status: this.STATUS_DELETED,
            updated_by: userDetail.id,
            updated_at: currentDate
        }, {
            where: {
                id: userID,
                created_by: userDetail.id,
                status: {
                    [Op.ne]: this.STATUS_DELETED
                }
            }
        }).then(data => {
            return true;
        }).catch(err => {
            logger.error("Unable to delete user");
            logger.error(err);
            return false;
        });
    }

    async findActiveUserByEmailAddress(email) {
        return await User.findOne({
            where: {
                email: email,
                status: this.STATUS_ACTIVE
            }
        });
    }

    async isPasswordHashValid(passwordHash, password) {
        try {
            return await argon2.verify(passwordHash, password);
        } catch (err) {
            logger.error("Unable to validate the password.");
            logger.error(err);
            return false;
        }
    }

    async changeAccountPassword(userID, newPassword) {
        /**
         * Hash the plain-text password.
         */
        let passwordHash = "";
        try {
            passwordHash = await argon2.hash(newPassword, {
                hashLength: securityConfig.password_hashing_algorithm.argon2.hash_length,
                timeCost: securityConfig.password_hashing_algorithm.argon2.time_cost,
                memoryCost: securityConfig.password_hashing_algorithm.argon2.memory_cost,
                parallelism: securityConfig.password_hashing_algorithm.argon2.paralellism,
                type: argon2.argon2id
            });
            if (passwordHash.trim() === "") {
                logger.error("Password hash is empty");
                return false;
            }
        } catch (err) {
            logger.error("Unable to hash the password.");
            logger.error(err);
            return false;
        }
        const currentDate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        return await User.update({
            updated_by: userID,
            updated_at: currentDate,
            password: passwordHash
        }, {
            where: {
                id: userID,
                status: this.STATUS_ACTIVE
            }
        });
    }

    async countSuperAdminUsers() {
        return await User.count({
            where: {
                role_id: UserRole.ROLE_SUPER_ADMIN,
                status: {
                    [Op.ne]: this.STATUS_DELETED
                }
            }
        });
    }
}

/**
 * Initialize the model, by defining the table schema.
 */
User.init({
    id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    created_by: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        defaultValue: 0
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    updated_by: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        defaultValue: 0
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM(['0', '1', '2']),
        comment: "0 (Archived), 1 (Active), 2 (Inactive)",
        allowNull: false,
        defaultValue: "1"
    },
    role_id: {
        type: DataTypes.INTEGER(),
        allowNull: false,
        defaultValue: 0
    },
    first_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    last_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
    },
    username: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false,
    }
}, {
    sequelize,
    modelName: "t_users",
    timestamps: false
});

/**
 * Export the model, so that it can be used in any
 * page to execute CRUD operations on the table.
 */
module.exports = User;