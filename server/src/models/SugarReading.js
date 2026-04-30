const mongoose = require("mongoose");

const sugarReadingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ChatSession",
      default: null
    },
    value: {
      type: Number,
      required: true,
      min: 20,
      max: 600
    },
    unit: {
      type: String,
      default: "mg/dL"
    },
    sourceMessage: {
      type: String,
      default: ""
    },
    recordedAt: {
      type: Date,
      default: Date.now,
      index: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("SugarReading", sugarReadingSchema);
