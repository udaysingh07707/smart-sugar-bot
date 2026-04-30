const KEYWORDS = ["sugar", "glucose", "blood sugar", "reading", "level", "mg/dl"];

const extractSugarReading = (message = "") => {
  const text = message.toLowerCase();
  const numberMatches = message.match(/\b(\d{2,3})\b/g);

  if (!numberMatches?.length) {
    return null;
  }

  const hasKeyword = KEYWORDS.some((keyword) => text.includes(keyword));

  if (!hasKeyword) {
    return null;
  }

  // Use the last valid number in the sentence to support messages like
  // "My fasting sugar this morning was around 128 mg/dL".
  for (let index = numberMatches.length - 1; index >= 0; index -= 1) {
    const value = Number(numberMatches[index]);
    if (value >= 20 && value <= 600) {
      return {
        value,
        unit: "mg/dL"
      };
    }
  }

  return null;
};

module.exports = { extractSugarReading };
