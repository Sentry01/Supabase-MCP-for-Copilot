require('dotenv').config();

const config = {
  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_SERVICE_KEY,
  },
  server: {
    port: parseInt(process.env.PORT || '3000', 10),
    host: process.env.HOST || 'localhost',
  },
  security: {
    allowedQueryTypes: process.env.ALLOWED_QUERY_TYPES 
      ? process.env.ALLOWED_QUERY_TYPES.split(',')
      : ['SELECT'],
    queryTimeout: parseInt(process.env.QUERY_TIMEOUT || '5000', 10),
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info',
  }
};

// Validate required configuration
function validateConfig() {
  const required = {
    'SUPABASE_URL': config.supabase.url,
    'SUPABASE_SERVICE_KEY': config.supabase.key,
  };

  const missing = Object.entries(required)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

validateConfig();

module.exports = config;