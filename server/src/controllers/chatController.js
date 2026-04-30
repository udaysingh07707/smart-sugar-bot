const ChatSession = require("../models/ChatSession");
const ChatMessage = require("../models/ChatMessage");
const SugarReading = require("../models/SugarReading");
const { extractSugarReading } = require("../utils/sugarParser");
const { getAssistantReply } = require("../services/aiService");

const buildTitle = (message) => {
  const trimmed = message.trim();
  if (trimmed.length <= 40) return trimmed;
  return `${trimmed.slice(0, 40)}...`;
};

const chat = async (req, res, next) => {
  try {
    const { message, sessionId } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ message: "Message is required" });
    }

    // Reuse an existing session when provided, otherwise create a new one.
    let session = null;

    if (sessionId) {
      session = await ChatSession.findOne({ _id: sessionId, user: req.userId });
      if (!session) {
        return res.status(404).json({ message: "Chat session not found" });
      }
    } else {
      session = await ChatSession.create({
        user: req.userId,
        title: buildTitle(message),
        lastMessageAt: new Date()
      });
    }

    // Keep recent context compact for lower token usage and faster responses.
    const previousMessages = await ChatMessage.find({
      user: req.userId,
      session: session._id
    })
      .sort({ timestamp: -1 })
      .limit(10)
      .lean();

    const orderedHistory = previousMessages.reverse().map((item) => ({
      role: item.role,
      content: item.content
    }));

    const userMessage = await ChatMessage.create({
      user: req.userId,
      session: session._id,
      role: "user",
      content: message.trim()
    });

    // Auto-detect sugar readings directly from natural language messages.
    const detectedReading = extractSugarReading(message);
    if (detectedReading) {
      await SugarReading.create({
        user: req.userId,
        session: session._id,
        value: detectedReading.value,
        unit: detectedReading.unit,
        sourceMessage: message.trim(),
        recordedAt: new Date()
      });
    }

    // Generate AI response using recent context and detected reading metadata.
    const assistantContent = await getAssistantReply({
      message: message.trim(),
      history: orderedHistory,
      reading: detectedReading
    });

    const assistantMessage = await ChatMessage.create({
      user: req.userId,
      session: session._id,
      role: "assistant",
      content: assistantContent
    });

    session.lastMessageAt = new Date();
    await session.save();

    return res.json({
      session: {
        id: session._id,
        title: session.title,
        createdAt: session.createdAt,
        updatedAt: session.updatedAt
      },
      userMessage: {
        id: userMessage._id,
        role: userMessage.role,
        content: userMessage.content,
        timestamp: userMessage.timestamp
      },
      assistantMessage: {
        id: assistantMessage._id,
        role: assistantMessage.role,
        content: assistantMessage.content,
        timestamp: assistantMessage.timestamp
      },
      detectedReading
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = { chat };
