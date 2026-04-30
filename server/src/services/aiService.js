const SKILLBOSS_API_KEY = (process.env.SKILLBOSS_API_KEY || "").trim();
const SKILLBOSS_BASE_URL = (process.env.SKILLBOSS_BASE_URL || "https://api.skillboss.co/v1")
  .trim()
  .replace(/\/+$/, "");
const SKILLBOSS_MODEL = (process.env.SKILLBOSS_MODEL || "openrouter/google/gemini-2.5-flash").trim();

const SYSTEM_PROMPT = `
You are GlucoGuide, a friendly blood sugar tracking assistant.
Style rules:
- Talk like a normal supportive person, not like a formal medical report.
- Mirror the user's tone and language style naturally.
- Use plain language, warm phrasing, and short paragraphs (2-5 sentences).
- Keep most replies under 90 words unless the user asks for detail.
- Avoid repeating the same sentence patterns.
- Do not use bullet points unless the user asks for a list.
Domain rules:
- Stay focused on blood sugar, food, exercise, medication reminders, and tracking habits.
- If a glucose reading is shared, acknowledge that it was logged and explain whether it looks low, in-range/moderate, or high.
- Give 1-2 practical next steps based on the user's context (meal timing, symptoms, trend).
- Ask one helpful follow-up question when it helps continue the conversation.
Safety rules:
- Do not diagnose diseases.
- If severe symptoms are mentioned (fainting, confusion, severe dizziness) or values are dangerously low/high, advise urgent medical care briefly.
`.trim();

const buildServiceErrorMessage = () =>
  "I could not reach the AI service right now. Please try again in a few seconds.";

const buildMissingKeyMessage = () =>
  "AI is not configured yet. Add SKILLBOSS_API_KEY in server/.env and restart the backend.";

const getReadingContext = (reading) => {
  if (!reading) {
    return "No glucose value detected in this message.";
  }

  return `Detected glucose reading from user message: ${reading.value} ${reading.unit}.`;
};

const buildMessages = ({ message, history = [], reading }) => [
  { role: "system", content: SYSTEM_PROMPT },
  { role: "system", content: getReadingContext(reading) },
  ...history
    .filter((item) => item && typeof item.content === "string" && typeof item.role === "string")
    .map((item) => ({ role: item.role, content: item.content })),
  { role: "user", content: message }
];

const getSkillBossReply = async ({ message, history, reading }) => {
  const response = await fetch(`${SKILLBOSS_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${SKILLBOSS_API_KEY}`
    },
    body: JSON.stringify({
      model: SKILLBOSS_MODEL,
      temperature: 0.55,
      messages: buildMessages({ message, history, reading })
    })
  });

  if (!response.ok) {
    let errorDetails = `HTTP ${response.status}`;
    try {
      const errorJson = await response.json();
      const errorMessage = errorJson?.error?.message || errorJson?.message;
      if (errorMessage) {
        errorDetails = `${errorDetails} - ${errorMessage}`;
      }
    } catch {
      // Keep generic HTTP details.
    }
    throw new Error(errorDetails);
  }

  const data = await response.json();

  // SkillBoss may return a wrapped error body with HTTP 200 in some cases.
  if (typeof data?.code === "number" && data.code >= 400) {
    throw new Error(data?.message || `SkillBoss error code ${data.code}`);
  }

  const content =
    data?.choices?.[0]?.message?.content?.trim() ||
    data?.data?.choices?.[0]?.message?.content?.trim() ||
    "";

  if (!content) {
    throw new Error("Empty response content from SkillBoss");
  }

  return content;
};

const getAssistantReply = async ({ message, history, reading }) => {
  if (!SKILLBOSS_API_KEY) {
    return buildMissingKeyMessage();
  }

  try {
    const content = await getSkillBossReply({ message, history, reading });
    return content || buildServiceErrorMessage();
  } catch (error) {
    console.error("SkillBoss request failed:", error.message);
    return buildServiceErrorMessage();
  }
};

module.exports = { getAssistantReply };
