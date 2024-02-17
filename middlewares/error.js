const logger = require('../util/logger');

const catchAllErrors = (err, req, res, next) => {
	if (err) {
		logger.error(JSON.stringify(err));
		if (err.type === 'entity.parse.failed') {
			return res.status(err.statusCode).json({
				message: 'Invalid request data.'
			});
		}
		return res.status(500).json({
			message: `Server error.`
		});
	}
	return next();
}

module.exports = {
    catchAllErrors
};
