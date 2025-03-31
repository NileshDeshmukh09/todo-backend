const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');

// Security headers
const securityHeaders = helmet();

// Rate limiting - more lenient for development
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // increased from 100 to 1000 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skipSuccessfulRequests: true, // Don't count successful requests
  keyGenerator: (req) => {
    // Use a combination of IP and user agent as the key
    return `${req.ip}-${req.headers['user-agent']}`;
  }
});

// Input sanitization
const sanitizeInput = xss();

module.exports = {
  securityHeaders,
  limiter,
  sanitizeInput
}; 