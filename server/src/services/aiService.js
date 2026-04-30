const OpenAI = require("openai");
const { getReadingAdvice, isHealthRelated } = require("../utils/healthAdvice");

const openaiClient = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

const SYSTEM_PROMPT = `
You are a supportive blood sugar tracking assistant.
- Give concise, practical advice.
- If user shares glucose readings, explain if it's low, moderate, or high.
- Include basic diet/lifestyle tips.
- Add a short safety note for severe symptoms (dizziness, confusion, fainting): seek urgent care.
- Do not diagnose diseases; remind user to follow clinician guidance.
`.trim();

const buildFallbackResponse = ({ message, reading }) => {
  if (reading) {
    const advice = getReadingAdvice(reading.value);
    return `Logged your reading: ${reading.value} ${reading.unit}. ${advice.tip} If you feel severe symptoms, contact emergency care immediately.`;
  }

  if (isHealthRelated(message)) {
    return "I can help with blood sugar tracking and guidance. Share readings like 'My sugar is 140' and I will log it with tips.";
  }

  return "I can help you track blood sugar and review trends. Tell me your reading any time, and I will save it.";
};

const getAssistantReply = async ({ message, history, reading }) => {
  if (!openaiClient) {
    return buildFallbackResponse({ message, reading });
  }

  const readingContext = reading
    ? `Detected glucose reading from user message: ${reading.value} ${reading.unit}.`
    : "No glucose value detected in this message.";

  try {
    const completion = await openaiClient.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
      temperature: 0.3,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "system", content: readingContext },
        ...history.map((item) => ({ role: item.role, content: item.content })),
        { role: "user", content: message }
      ]
    });

    const content = completion.choices?.[0]?.message?.content?.trim();
    return content || buildFallbackResponse({ message, reading });
  } catch (error) {
    console.error("OpenAI request failed:", error.message);
    return buildFallbackResponse({ message, reading });
  }
};

module.exports = { getAssistantReply };
