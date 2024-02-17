const dotenv = require("dotenv");
dotenv.config();

module.exports = {
    password_hashing_algorithm: {
        argon2: {
            hash_length: process.env.ARGON2_HASH_LENGTH,
            time_cost: process.env.ARGON2_TIME_COST,
            memory_cost: process.env.ARGON2_MEMORY_COST,
            paralellism: process.env.ARGON2_PARALELLISM,
        }
    }
}