const express = require("express");
const { addSugarReading, getSugarReadings } = require("../controllers/sugarController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, addSugarReading);
router.get("/", protect, getSugarReadings);

module.exports = router;
