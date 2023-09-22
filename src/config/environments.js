module.exports = {
  app: {
    port: process.env.port,
    environment: process.env.NODE_ENV,
    cors_origin: process.env.CORS_ORIGIN,
    database: process.env.DATABASE,
  },

  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || 86400 // 24 hours
  },

  mongo: {
    host: process.env.MONGO_HOST || "localhost",
    database: process.env.MONGO_DATABASE,
    user: process.env.MONGO_USER || "developer",
    password: process.env.MONGO_PASSWORD || "secret",
    port: process.env.MONGO_PORT || 27017,
    url:
      process.env.MONGO_URL ||
      `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DATABASE}?authSource=admin`,
  },
};
