// const dotenv = require("dotenv");
// dotenv.config();
// const redis = require('redis');
// const redisClient = redis.createClient({
//     password: process.env.REDIS_AUTH_PASSWORD
// });
// redisClient.connect();
// const {
//     promisify
// } = require('util');
// const setAsync = promisify(redisClient.set).bind(redisClient);
// const getAsync = promisify(redisClient.get).bind(redisClient);
// module.exports = {
//     redisClient: redisClient,
//     setAsync: setAsync,
//     getAsync: getAsync
// };