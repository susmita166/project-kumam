const { Sequelize, DataTypes, Model, Op } = require("sequelize");
const sequelize = require("../../util/database");
const logger = require('../../util/logger');
const moment = require('moment');
const jwt = require('jsonwebtoken');

class PersonalAccessToken extends Model {

    STATUS_DELETED = "0";
    STATUS_ACTIVE = "1";
    STATUS_INACTIVE = "2";

    USER_TYPE_SUPER_ADMIN = "1";
    USER_TYPE_HUD = "2";
    USER_TYPE_WRU = "3";
    USER_TYPE_SUDA = "4";
    USER_TYPE_ULB = "5";

    selectiveFields = [
        'id', 'last_used_at', 'client_browser_name', 'client_browser_version', 'client_platform'
    ];

    getUserTypeIdByDepartmentID(departmentID) {
        let userTypeID = 0;
        switch (departmentID) {
            case "1":
                userTypeID = this.USER_TYPE_HUD;
                break;
            case "2":
                userTypeID = this.USER_TYPE_WRU;
                break;
            case "3":
                userTypeID = this.USER_TYPE_SUDA;
                break;
            case "4":
                userTypeID = this.USER_TYPE_ULB;
                break;
            default:
                break;
        }
        return userTypeID;
    }

    /**
     * -----------------------
     * Generate Token For User
     * -----------------------
     * Generates a unique JWT token for a user, save it to the database, and return the token.
     * @method generateTokenForSuperAdmin
     * @param object userDetail
     * @param any userAgent
     */
    async generateTokenForSuperAdmin(userDetail, userAgent = null, clientIPAddress = null) {
        /**
         * Generate a JWT Token and sign it.
         */
        const tokenExpiryDate = moment(new Date()).add(12, 'hours');
        const token = await jwt.sign({
            user: {
                full_name: (`${userDetail.first_name} ${userDetail.last_name}`).trim(),
                email: userDetail.email,
            }
        }, process.env.JWT_SECRET_KEY, {
            algorithm: 'HS512',
            expiresIn: '12h'
        });
        /**
         * Insert the token to the database.
         */
        const currentDate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        const tokenExpiryDateFormatted = moment(tokenExpiryDate).format("YYYY-MM-DD HH:mm:ss");

        let clientPlatform = null;
        if (userAgent && userAgent.os && userAgent.os.family) {
            clientPlatform = `${userAgent.os.family}`;
            if (userAgent.os.major && userAgent.os.major > 0) {
                clientPlatform += ` ${userAgent.os.major}`;
            }
        }

        if (clientPlatform && clientPlatform.toLowerCase() === 'other') {
            clientPlatform = null;
        }

        let clientBrowserVersion = null;

        if (userAgent && userAgent?.major && userAgent?.major > 0) {
            clientBrowserVersion = userAgent.major;
        }

        if (!clientBrowserVersion && userAgent && (userAgent.actual_agent.toLowerCase()).includes('postman')) {
            let postmanVersion = (userAgent.actual_agent.toLowerCase()).split('/')[1];
            if (postmanVersion) {
                clientBrowserVersion = postmanVersion;
            }
        }

        await PersonalAccessToken.create({
            created_by: 0,
            created_at: currentDate,
            updated_by: 0,
            updated_at: currentDate,
            status: this.STATUS_ACTIVE,
            user_type: this.USER_TYPE_SUPER_ADMIN,
            user_id: userDetail.id,
            token: token,
            last_used_at: currentDate,
            expires_at: tokenExpiryDateFormatted,
            client_browser_name: (userAgent && userAgent?.family) ? this.getBrowserFullName(userAgent.family, userAgent.actual_agent) : null,
            client_browser_version: clientBrowserVersion,
            client_platform: clientPlatform,
            client_ip_address: clientIPAddress
        }).then(data => {
            return true;
        }).catch(err => {
            logger.error("Unable to generate token for the user.");
            logger.error(err);
            return false;
        });
        return {
            token: token,
            expiryDate: tokenExpiryDateFormatted
        };
    }

    /**
     * -----------------
     * Find Token Detail
     * -----------------
     * Returns the detail of a token.
     * @method findSuperAdminTokenDetail
     * @param string token 
     */
    async findSuperAdminTokenDetail(token) {
        return await PersonalAccessToken.findOne({
            where: {
                token: token,
                status: this.STATUS_ACTIVE,
                user_type: this.USER_TYPE_SUPER_ADMIN
            }
        });
    }

    async findUserTokenDetail(token) {
        return await PersonalAccessToken.findOne({
            where: {
                token: token,
                status: this.STATUS_ACTIVE,
                user_type: {
                    [Op.ne]: this.USER_TYPE_SUPER_ADMIN
                }
            }
        });
    }

    /**
     * ---------------------------
     * Update Token Last Used Time
     * ---------------------------
     * Updates the last used date and time of the token.
     * @method updateTokenLastUsedTime
     * @param string tokenID 
     */
    async updateTokenLastUsedTime(tokenID) {
        const currentDate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss"); 
        PersonalAccessToken.update({
            last_used_at: currentDate
        }, {
            where: {
                id: tokenID
            }
        });
    }

    /**
     * ---------------------------------
     * Find Logged In Devices By User ID
     * ---------------------------------
     * Returns the list of devices where the user is logged-in.
     * @method findLoggedInDevicesByUserID
     * @param string userID 
     */
    async findLoggedInDevicesByUserID(userID, currentTokenID) {
        const devicesTokens = await PersonalAccessToken.findAll({
            attributes: [...this.selectiveFields],
            where: {
                user_id: userID,
                status: this.STATUS_ACTIVE
            }
        });
        let index = 0;
        const devicesTokensMod = [];
        for (const singleToken of devicesTokens) {
            const isCurrentDevice = await ((singleToken.id == currentTokenID) ? true : false);
            singleToken.setDataValue('is_current_device', isCurrentDevice);
            devicesTokensMod.push(singleToken);
            index++;
        }
        return devicesTokensMod;
    }

    /**
     * -----------------------------------------
     * Find Token Detail By Token ID and User ID
     * -----------------------------------------
     * Returns the detail of the token assigned to the user.
     * @method findTokenDetailByTokenIDAndUserID
     * @param string userID 
     * @param string tokenID
     */
    async findTokenDetailByTokenIDAndUserID(userID, tokenID) {
        return await PersonalAccessToken.findOne({
            where: {
                user_id: userID,
                id: tokenID,
                status: this.STATUS_ACTIVE
            }
        });
    }

    /**
     * -------------
     * Archive Token
     * -------------
     * Changes the status of the token to archived.
     * @method archiveToken
     * @param object userDetail 
     * @param string token 
     */
    async archiveToken(userDetail, token) {
        const currentDate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        return await PersonalAccessToken.update({
            updated_by: userDetail.id,
            updated_at: currentDate,
            status: this.STATUS_DELETED
        }, {
            where: {
                token: token
            }
        });
    }
    
    async generateTokenForUser(userDetail, userAgent = null, departmentID, clientIPAddress = null) {
        const tokenExpiryDate = moment(new Date()).add(12, 'hours');
        const token = await jwt.sign({
            user: {
                name: userDetail.name,
                email: userDetail.email,
                profile_picture: userDetail.profile_picture
            }
        }, process.env.JWT_SECRET_KEY, {
            algorithm: 'HS512',
            expiresIn: '12h'
        });

        let clientPlatform = null;
        if (userAgent && userAgent.os && userAgent.os.family) {
            clientPlatform = `${userAgent.os.family}`;
            if (userAgent.os.major && userAgent.os.major > 0) {
                clientPlatform += ` ${userAgent.os.major}`;
            }
        }

        if (clientPlatform && clientPlatform.toLowerCase() === 'other') {
            clientPlatform = null;
        }

        let clientBrowserVersion = null;

        if (userAgent && userAgent?.major && userAgent?.major > 0) {
            clientBrowserVersion = userAgent.major;
        }

        if (!clientBrowserVersion && userAgent && (userAgent.actual_agent.toLowerCase()).includes('postman')) {
            let postmanVersion = (userAgent.actual_agent.toLowerCase()).split('/')[1];
            if (postmanVersion) {
                clientBrowserVersion = postmanVersion;
            }
        }

        /**
         * Insert the token to the database.
         */
        const currentDate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        const tokenExpiryDateFormatted = moment(tokenExpiryDate).format("YYYY-MM-DD HH:mm:ss");
        await PersonalAccessToken.create({
            created_by: 0,
            created_at: currentDate,
            updated_by: 0,
            updated_at: currentDate,
            status: this.STATUS_ACTIVE,
            user_type: this.getUserTypeIdByDepartmentID(departmentID),
            user_id: userDetail.id,
            token: token,
            last_used_at: currentDate,
            expires_at: tokenExpiryDateFormatted,
            client_browser_name: (userAgent && userAgent?.family) ? this.getBrowserFullName(userAgent.family, userAgent.actual_agent) : null,
            client_browser_version: clientBrowserVersion,
            client_platform: clientPlatform,
            client_ip_address: clientIPAddress
        }).then(data => {
            return true;
        }).catch(err => {
            logger.error("Unable to generate token for the user.");
            logger.error(err);
            return false;
        });
        return {
            token: token,
            expiryDate: tokenExpiryDateFormatted
        };
    }

    getBrowserFullName(partialName, actualAgent) {
        const webBrowsers = ["Google Chrome", "Mozilla Firefox", "Apple Safari", "Microsoft Edge", "Opera", "Internet Explorer", "Brave", "Vivaldi", "UC Browser", "Chromium", "Tor Browser", "Maxthon", "Avant Browser", "Epic Privacy Browser", "SeaMonkey", "Pale Moon", "Midori", "Konqueror", "Waterfox", "Yandex Browser", "Sleipnir", "Comodo Dragon", "Blisk", "Flock", "Ghost Browser", "Coc Coc", "Torch Browser", "Qutebrowser", "DuckDuckGo Privacy Browser", "Beaker Browser", "Puffin Browser", "Samsung Internet", "Naked Browser", "CM Browser", "Phoenix Browser", "Bromite", "Iridium Browser", "GNU IceCat", "Otter Browser", "Dooble", "Wyzo", "Gnuzilla", "SalamWeb", "Epic Browser", "Sputnik Browser", "Yuzu Browser", "Whale Browser", "BriskBard", "Polarity Browser", "Superbird", "Avast Secure Browser", "Cent Browser", "GreenBrowser", "Slimjet", "Tungsten Browser", "WhiteHat Aviator", "Cavalry Browser", "Falkon", "Galeon", "K-Meleon", "Lunascape", "NetSurf", "Orca Browser", "QupZilla", "Sundance", "Dooble Web Browser", "Comodo IceDragon", "Coc Coc Browser"];
        let browserMap = new Map();
        for (const browser of webBrowsers) {
            const lowerCaseName = browser.toLowerCase();
            browserMap.set(lowerCaseName, browser);
        }
        const partialNameLower = partialName.toLowerCase();
        for (const [lowerCaseName, fullName] of browserMap) {
            if (lowerCaseName.includes(partialNameLower)) {
                return fullName;
            }
        }
        if (partialName.toLowerCase() === 'other') {
            partialName = null;
            if ((actualAgent.toLowerCase()).includes('postman')) {
                partialName = 'Postman Runtime'
            }
        }
        return partialName;
    }
}

/**
 * Initialize the model, by defining the table schema.
 */
PersonalAccessToken.init({
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
    user_type: {
        type: DataTypes.ENUM(['1', '2', '3', '4', '5']),
        comment: "1 (Super Admin), 2 (HUD), 3 (WRU), 4 (SUDA), 5 (ULB)",
        allowNull: false,
        defaultValue: "1"
    },
    user_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
    },
    token: {
        type: DataTypes.STRING(4096),
        allowNull: false,
    },
    last_used_at: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    expires_at: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    client_browser_name: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    client_browser_version: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    client_platform: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    client_ip_address: {
        type: DataTypes.STRING(255),
        allowNull: true
    }
}, {
    sequelize,
    modelName: "t_personal_access_tokens",
    timestamps: false
});

/**
 * Export the model, so that it can be used in any
 * page to execute CRUD operations on the table.
 */
module.exports = PersonalAccessToken;