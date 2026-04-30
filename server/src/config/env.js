const validateEnv = () => {
  const nodeEnv = process.env.NODE_ENV || "development";
  const mongoUri = (process.env.MONGO_URI || "").trim();
  const jwtSecret = (process.env.JWT_SECRET || "").trim();
  const skillBossApiKey = (process.env.SKILLBOSS_API_KEY || "").trim();

  if (!mongoUri) {
    throw new Error("MONGO_URI is not configured");
  }

  if (!jwtSecret) {
    throw new Error("JWT_SECRET is not configured");
  }

  const usingDefaultSecret = jwtSecret === "replace-with-a-strong-secret";
  const weakSecret = jwtSecret.length < 24;

  if (nodeEnv === "production" && (usingDefaultSecret || weakSecret)) {
    throw new Error("JWT_SECRET must be a strong non-default value in production");
  }

  if (nodeEnv !== "production" && usingDefaultSecret) {
    console.warn("Warning: using default JWT_SECRET. Set a strong value before deployment.");
  }

  if (nodeEnv === "production" && /localhost|127\.0\.0\.1/.test(mongoUri)) {
    console.warn("Warning: MONGO_URI points to local MongoDB while NODE_ENV=production.");
  }

  if (nodeEnv === "production" && !skillBossApiKey) {
    console.warn("Warning: no SkillBoss API key configured. Chat will use rule-based fallback replies.");
  }
};

module.exports = { validateEnv };
