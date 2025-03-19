const { createHash } = require('crypto');
const config = require('../config');

// Simple in-memory rate limiting store
const rateLimitStore = new Map();

class SecurityMiddleware {
  constructor(options = {}) {
    this.keyValidityDuration = options.keyValidityDuration || 3600000; // 1 hour
    this.rateLimit = options.rateLimit || 100; // requests per window
    this.rateLimitWindow = options.rateLimitWindow || 60000; // 1 minute window
  }

  validateApiKey(key) {
    if (!key) {
      throw new Error('API key is required');
    }

    // Hash the provided key for comparison
    const hashedKey = createHash('sha256').update(key).digest('hex');
    
    // Compare with stored key hash
    const storedKeyHash = createHash('sha256')
      .update(config.supabase.key)
      .digest('hex');

    return hashedKey === storedKeyHash;
  }

  checkRateLimit(clientId) {
    const now = Date.now();
    const clientKey = `${clientId}:${Math.floor(now / this.rateLimitWindow)}`;
    
    let requests = rateLimitStore.get(clientKey) || 0;
    
    if (requests >= this.rateLimit) {
      throw new Error('Rate limit exceeded');
    }
    
    rateLimitStore.set(clientKey, requests + 1);
    
    // Cleanup old entries every 5 minutes
    if (now % 300000 < 1000) {
      this.cleanupRateLimitStore();
    }
    
    return true;
  }

  cleanupRateLimitStore() {
    const now = Date.now();
    const windowStart = Math.floor(now / this.rateLimitWindow);
    
    for (const [key] of rateLimitStore) {
      const [, windowKey] = key.split(':');
      if (parseInt(windowKey) < windowStart) {
        rateLimitStore.delete(key);
      }
    }
  }

  maskSensitiveData(data, sensitiveFields = ['password', 'email', 'phone', 'ssn', 'credit_card']) {
    if (typeof data !== 'object' || data === null) {
      return data;
    }

    const masked = Array.isArray(data) ? [...data] : { ...data };

    for (const [key, value] of Object.entries(masked)) {
      if (sensitiveFields.includes(key.toLowerCase())) {
        masked[key] = '********';
      } else if (typeof value === 'object' && value !== null) {
        masked[key] = this.maskSensitiveData(value, sensitiveFields);
      }
    }

    return masked;
  }

  async middleware(context, next) {
    try {
      // Validate API key
      const apiKey = context.request.headers['x-api-key'];
      if (!this.validateApiKey(apiKey)) {
        throw new Error('Invalid API key');
      }

      // Check rate limit
      const clientId = context.request.headers['x-client-id'] || apiKey;
      this.checkRateLimit(clientId);

      // Process the request
      await next();

      // Mask sensitive data in response
      if (context.response.body) {
        context.response.body = this.maskSensitiveData(context.response.body);
      }
    } catch (error) {
      context.response.status = error.status || 401;
      context.response.body = { error: error.message };
    }
  }
}

module.exports = { SecurityMiddleware };