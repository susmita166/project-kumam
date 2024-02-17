/**
 * Import Sequelize.
 */
const Sequelize = require("sequelize");
const databaseConfig = require('../config/database');
/**
 * Define the sequelize config for different environments.
 */
let seqConfig = {};

switch ((process.env.ENVIRONMENT).toLowerCase()) {
    /**
     * Configuration for development environment.
     */
    case "development":
        seqConfig = {
            dialect: databaseConfig.development.dialect,
            host: databaseConfig.development.host,
            database: databaseConfig.development.database,
            username: databaseConfig.development.username,
            password: databaseConfig.development.password,
            port: databaseConfig.development.port,
            timezone: databaseConfig.development.timezone,
            dialectOptions: databaseConfig.development.dialectOptions
        };
        break;
    /**
     * Configuration for test/staging environment.
     */
    case "test":
        seqConfig = {
            dialect: databaseConfig.test.dialect,
            host: databaseConfig.development.host,
            database: databaseConfig.test.database,
            username: databaseConfig.test.username,
            password: databaseConfig.test.password,
            port: databaseConfig.test.port,
            timezone: databaseConfig.test.timezone,
            dialectOptions: databaseConfig.test.dialectOptions
        };
        break;
    /**
     * Configuration for production environment.
     */
    case "production":
        seqConfig = {
            dialect: databaseConfig.production.dialect,
            host: databaseConfig.development.host,
            database: databaseConfig.production.database,
            username: databaseConfig.production.username,
            password: databaseConfig.production.password,
            port: databaseConfig.production.port,
            timezone: databaseConfig.production.timezone,
            dialectOptions: databaseConfig.production.dialectOptions
        };
        break;
    default:
        break;
}
/**
 * Create a Sequelize instance. This can be done by passing
 * the connection parameters separately to the Sequelize constructor.
 */
const sequelize = new Sequelize({...seqConfig});
/**
 * Export the Sequelize instance. This instance can now be 
 * used in the app.js file to authenticate and establish a database connection.
 */
module.exports = sequelize;