/**
 * Initialize the express app, and import the file system module and https module.
 */
const fs = require('fs');
const https = require('https');
const express = require('express');
const app = express();
/**
 * Load the environment variables from the .env file.
 */
const dotenv = require("dotenv");
dotenv.config();
const port = (process.env.ENVIRONMENT === 'development') ? process.env.APP_PORT : 443;
/**
 * Enable the response compression.
 */
const compression = require('compression');
app.use(compression());
/**
 * Initialize the logger.
 */
const logger = require('./util/logger');
/**
 * Enable the helmet middleware.
 * It protects the app from well-known web vulnerabilities by setting HTTP security headers.
 */
const helmet = require('helmet');
app.use(helmet());
/**
 * Enable the cors middleware.
 * It enables accepting cross-origin requests.
 */
const cors = require('cors');
app.use(cors());
/**
 * Enable the JSON request body parser middleware, 
 * and URLEncoded request body parser middleware.
 */
app.use(express.query());
app.use(express.json());
app.use(express.urlencoded({
	extended: true
}));
/**
 * Enable form data request body parser middleware, and upload files.
 */
const multer = require('multer')
const upload = multer({
	dest: 'public/uploads'
});
/**
 * Enable request rate limiting to help put a limit on the network traffic. This puts a cap on how often someone can repeat an action within a certain timeframe.
 */
const rateLimit = require('express-rate-limit');
const appConfig = require('./config/app');
app.use(
	rateLimit({
		windowMs: appConfig.rate_limit_window,
		max: appConfig.hits_per_window,
		standardHeaders: appConfig.rate_limit_header,
		legacyHeaders: appConfig.legacy_rate_limit_header,
		message: {
			message: appConfig.rate_limit_exceeded_message
		}
	})
);
/**
 * Define the response body for the home route.
 */
app.get('/', (req, res) => {
	res.json({
		message: 'The server is up and running.'
	});
});
/**
 * Add a middleware to serve the static files like images, archives, css, js, etc.
 */
app.use("/cdn", express.static('public'));
/**
 * Register all routes.
 */
const webRoutes = require('./routes/web');
webRoutes.forEach(item => {
	app.use(item.entryPoint, item.routes);
});
app.get('/api', (req, res) => {
	res.json({
		message: 'The server is up and running.'
	});
});
/**
 * Define the 404 route.
 */
app.use('*', function (req, res) {
	return res.status(404).json({
		message: 'Page not found.'
	});
});
/**
 * Load the database utility.
 */
const db = require('./util/database');
/**
 * Catch any server errors.
 */
const errorMiddleware = require('./middlewares/error');
app.use(errorMiddleware.catchAllErrors);
/**
 * Start the application.
 */
const initApp = async () => {
	try {
		/**
		 * Establish the database connection.
		 */
		await db.authenticate();
		logger.info("Database connection has been established.");
		/**
		 * Start the web server on the specified port.
		 */
		if (process.env.ENVIRONMENT === 'development') {
			app.listen(port, () => {
				logger.info(`Server is up and running at port: ${port}`);
			});
		} else {
			https.createServer({
				key: fs.readFileSync('/etc/pki/tls/certs/estplnet.key'),
				cert: fs.readFileSync('/etc/pki/tls/certs/estplnet.crt'),
				ca: fs.readFileSync('/etc/pki/tls/certs/alphasslrootcabundle-g4.crt')
			}, app).listen(port, () => {
				logger.info(`Server is up and running at port: ${port}`);
			});
			app.listen(process.env.APP_PORT, () => {
				logger.info(`Server is up and running at port: ${process.env.APP_PORT}`);
			});
		}
		/**
		 * Log the message into the console.
		 */
		console.log(`Server is up and running at port: ${port}`);
	} catch (error) {
		logger.error("Unable to start the server: " + error);
		/**
		 * Log the message into the console.
		 */
		console.log("Error: Unable to start the server: " + error);
	}
}
/**
 * Initialize the application.
 */
initApp();