const logger = require("../utils/logger");

/**
 * Middleware to catch 404 unmatched routes.
 * Logs and prints the missing route details and returns a standardized JSON 404 response.
 */
const notFoundHandler = (req, res, _next) => {
    const message = `Route not found: ${req.method} ${req.originalUrl}`;
    
    logger.warn(`[404 Route Not Found] ${req.method} ${req.originalUrl} - IP: ${req.ip}`);
    console.error(`[404 Route Not Found] ${req.method} ${req.originalUrl}`);

    res.status(404).json({
        success: false,
        message: message,
        errors: [`No matching route handler for ${req.method} ${req.originalUrl}`]
    });
};

module.exports = notFoundHandler;
