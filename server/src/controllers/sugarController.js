const SugarReading = require("../models/SugarReading");

const addSugarReading = async (req, res, next) => {
  try {
    const { value, recordedAt } = req.body;

    if (value === undefined || value === null) {
      return res.status(400).json({ message: "Sugar value is required" });
    }

    const numericValue = Number(value);
    if (Number.isNaN(numericValue)) {
      return res.status(400).json({ message: "Sugar value must be a number" });
    }

    const reading = await SugarReading.create({
      user: req.userId,
      value: numericValue,
      recordedAt: recordedAt ? new Date(recordedAt) : new Date()
    });

    return res.status(201).json({
      id: reading._id,
      value: reading.value,
      unit: reading.unit,
      recordedAt: reading.recordedAt
    });
  } catch (error) {
    return next(error);
  }
};

const getSugarReadings = async (req, res, next) => {
  try {
    const limit = Math.min(Number(req.query.limit || 50), 200);
    const readings = await SugarReading.find({ user: req.userId })
      .sort({ recordedAt: -1 })
      .limit(limit)
      .lean();

    return res.json({ readings });
  } catch (error) {
    return next(error);
  }
};

module.exports = { addSugarReading, getSugarReadings };
