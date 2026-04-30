const HEALTH_KEYWORDS = [
  "sugar",
  "glucose",
  "diabetes",
  "hypoglycemia",
  "hyperglycemia",
  "insulin",
  "reading",
  "level"
];

const isHealthRelated = (message = "") => {
  const text = message.toLowerCase();
  return HEALTH_KEYWORDS.some((keyword) => text.includes(keyword));
};

const getReadingAdvice = (value) => {
  if (value < 70) {
    return {
      severity: "low",
      tip: "Your reading looks low. Consider quick glucose (like juice or glucose tablets) and recheck in ~15 minutes."
    };
  }

  if (value > 180) {
    return {
      severity: "high",
      tip: "Your reading is elevated. Hydrate, avoid high-sugar foods, and consider a short walk if your clinician has advised it."
    };
  }

  return {
    severity: "normal",
    tip: "This reading is in a moderate range for many adults. Keep following your care plan and continue monitoring."
  };
};

module.exports = { isHealthRelated, getReadingAdvice };
