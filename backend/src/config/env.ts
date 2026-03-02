const requireEnv = (key: string, fallback?: string) => {
  const value = process.env[key] || fallback;
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

export const config = {
  port: process.env.PORT || 4000,
  nodeEnv: process.env.NODE_ENV || 'development',

  database: {
    url: process.env.DATABASE_URL,
  },

  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT) || 6379,
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'default-secret-change-me',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'default-refresh-secret',
    expiresIn: process.env.JWT_EXPIRATION || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d',
  },

  payments: {
    razorpayKeyId: process.env.RAZORPAY_KEY_ID,
    razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET,
    razorpayWebhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET,
  },
};

export const validateEnv = () => {
  if (config.nodeEnv === 'production') {
    requireEnv('DATABASE_URL');
    requireEnv('JWT_SECRET');
    requireEnv('JWT_REFRESH_SECRET');
    requireEnv('RAZORPAY_KEY_ID');
    requireEnv('RAZORPAY_KEY_SECRET');
    requireEnv('RAZORPAY_WEBHOOK_SECRET');
  }
};
