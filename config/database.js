/**
 * Load the environment variables from the .env file.
 */
const moment = require('moment');
const dotenv = require("dotenv");
dotenv.config();

module.exports = {
	development: {
		username: process.env.DEV_DB_USERNAME,
		password: process.env.DEV_DB_PASSWORD,
		database: process.env.DEV_DB_NAME,
		host: process.env.DEV_DB_HOST,
		port: process.env.DEV_DB_PORT,
		dialect: process.env.DATABASE_DIALECT,
		dialectOptions: {
			bigNumberStrings: false,
			dateStrings: true,
			typeCast: function (field, next) {
				if (field.type === 'DATETIME') {
					return moment(field.string()).format('YYYY-MM-DD HH:mm:ss');
				}
				return next();
			}
		},
		timezone: process.env.DATABASE_TIMEZONE,
		migrationStorageTableName: process.env.DB_MIGRATION_TABLE
	},
	test: {
		username: process.env.STAG_DB_USERNAME,
		password: process.env.STAG_DB_PASSWORD,
		database: process.env.STAG_DB_NAME,
		host: process.env.STAG_DB_HOST,
		port: process.env.STAG_DB_PORT,
		dialect: process.env.DATABASE_DIALECT,
		dialectOptions: {
			bigNumberStrings: false,
			dateStrings: true,
			typeCast: function (field, next) {
				if (field.type === 'DATETIME') {
					const date = moment(field.string()).format('YYYY-MM-DD HH:mm:ss');
      				return date;
				}
				return next();
			}
		},
		timezone: process.env.DATABASE_TIMEZONE,
		migrationStorageTableName: process.env.DB_MIGRATION_TABLE
	},
	production: {
		username: process.env.PROD_DB_USERNAME,
		password: process.env.PROD_DB_PASSWORD,
		database: process.env.PROD_DB_NAME,
		host: process.env.PROD_DB_HOSTNAME,
		port: process.env.PROD_DB_PORT,
		dialect: process.env.DATABASE_DIALECT,
		dialectOptions: {
			bigNumberStrings: false,
			dateStrings: true,
			typeCast: function (field, next) {
				if (field.type === 'DATETIME') {
					const date = moment(field.string()).format('YYYY-MM-DD HH:mm:ss');
      				return date;
				}
				return next();
			}
		},
		timezone: process.env.DATABASE_TIMEZONE,
		migrationStorageTableName: process.env.DB_MIGRATION_TABLE
	}
};