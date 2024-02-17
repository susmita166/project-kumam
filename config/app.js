module.exports = {
    /**
     * --------
     * BASE URL
     * --------
     * Set the base url of the project.
     */
    baseUrl: process.env.BASE_URL,
    /**
     * -------------------------
     * Request Rate Limit Window
     * -------------------------
     * Set the time in milliseconds for specifying the window time.
     */
    rate_limit_window: process.env.RATE_LIMIT_WINDOW,
    /**
     * -----------------------
     * Request Hits Per Window
     * -----------------------
     * Set the maximum number of requests that a user (per IP) can hit the window.
     * Example: 100 hits per 1 minute.
     */
    hits_per_window: process.env.HITS_PER_WINDOW,
    /**
     * ------------------
     * Rate Limit Headers
     * ------------------
     * Specify if you want to return the rate limit headers in the response body.
     */
    rate_limit_header: (process.env.RATE_LIMIT_HEADERS == "ON") ? true : false,
    /**
     * -------------------------
     * Legacy Rate Limit Headers
     * -------------------------
     * Specify if you want to return the legacy x-rate limit headers in the response body.
     */
    legacy_rate_limit_header: (process.env.LEGACY_RATE_LIMIT_HEADERS == "ON") ? true : false,
    /**
     * ---------------------------
     * Rate Limit Exceeded Message
     * ---------------------------
     * Specify the message you want to return in the response body when API endpoint exceeds the rate limit.
     */
    rate_limit_exceeded_message: `Too many requests. Please try after a minute.`
}