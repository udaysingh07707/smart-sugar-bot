const mongoose = require("mongoose");
const SugarReading = require("../models/SugarReading");

const toUtcDateKey = (value) => new Date(value).toISOString().slice(0, 10);

const getAnalytics = async (req, res, next) => {
  try {
    const now = new Date();
    const startOfTodayUtc = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    const sevenDaysAgo = new Date(startOfTodayUtc);
    sevenDaysAgo.setUTCDate(startOfTodayUtc.getUTCDate() - 6);

    // Fetch the last 7 days of readings for trend visualization.
    const recentReadings = await SugarReading.find({
      user: req.userId,
      recordedAt: { $gte: sevenDaysAgo }
    })
      .sort({ recordedAt: 1 })
      .lean();

    // Pre-fill all 7 days so chart axes stay stable even with missing days.
    const dailyMap = {};
    for (let i = 0; i < 7; i += 1) {
      const date = new Date(sevenDaysAgo);
      date.setUTCDate(sevenDaysAgo.getUTCDate() + i);
      const key = toUtcDateKey(date);
      dailyMap[key] = [];
    }

    recentReadings.forEach((reading) => {
      const key = toUtcDateKey(reading.recordedAt);
      if (dailyMap[key]) {
        dailyMap[key].push(reading.value);
      }
    });

    const last7Days = Object.entries(dailyMap).map(([date, values]) => {
      if (!values.length) {
        return { date, average: null, count: 0 };
      }

      const sum = values.reduce((acc, value) => acc + value, 0);
      return {
        date,
        average: Number((sum / values.length).toFixed(1)),
        count: values.length
      };
    });

    // Aggregation pipelines do not auto-cast string ids, so cast explicitly.
    const userObjectId = new mongoose.Types.ObjectId(req.userId);

    const aggregate = await SugarReading.aggregate([
      { $match: { user: userObjectId } },
      {
        $group: {
          _id: null,
          avg: { $avg: "$value" },
          count: { $sum: 1 }
        }
      }
    ]);

    const overall = aggregate[0] || { avg: null, count: 0 };

    return res.json({
      averageSugarLevel: overall.avg ? Number(overall.avg.toFixed(1)) : null,
      totalReadings: overall.count,
      last7Days,
      recentReadings: recentReadings.map((reading) => ({
        id: reading._id,
        value: reading.value,
        unit: reading.unit,
        recordedAt: reading.recordedAt
      }))
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = { getAnalytics };
