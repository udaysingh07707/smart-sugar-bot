const ChatSession = require("../models/ChatSession");
const ChatMessage = require("../models/ChatMessage");

const getHistory = async (req, res, next) => {
  try {
    const sessions = await ChatSession.find({ user: req.userId })
      .sort({ lastMessageAt: -1 })
      .lean();

    const sessionsWithPreview = await Promise.all(
      sessions.map(async (session) => {
        const lastMessage = await ChatMessage.findOne({
          user: req.userId,
          session: session._id
        })
          .sort({ timestamp: -1 })
          .lean();

        return {
          id: session._id,
          title: session.title,
          createdAt: session.createdAt,
          updatedAt: session.updatedAt,
          lastMessageAt: session.lastMessageAt,
          lastMessagePreview: lastMessage?.content?.slice(0, 80) || ""
        };
      })
    );

    return res.json({ sessions: sessionsWithPreview });
  } catch (error) {
    return next(error);
  }
};

const getSessionMessages = async (req, res, next) => {
  try {
    const { sessionId } = req.params;

    const session = await ChatSession.findOne({ _id: sessionId, user: req.userId }).lean();
    if (!session) {
      return res.status(404).json({ message: "Chat session not found" });
    }

    const messages = await ChatMessage.find({ user: req.userId, session: sessionId })
      .sort({ timestamp: 1 })
      .lean();

    return res.json({
      session: {
        id: session._id,
        title: session.title,
        createdAt: session.createdAt,
        updatedAt: session.updatedAt
      },
      messages: messages.map((item) => ({
        id: item._id,
        role: item.role,
        content: item.content,
        timestamp: item.timestamp
      }))
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = { getHistory, getSessionMessages };
