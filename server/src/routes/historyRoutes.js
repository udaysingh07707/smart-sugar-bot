const express = require("express");
const { getHistory, getSessionMessages } = require("../controllers/historyController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getHistory);
router.get("/:sessionId", protect, getSessionMessages);

module.exports = router;
