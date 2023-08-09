const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, "Silahkan isi nama company"],
      maxlength: 50,
    },
    position: {
      type: String,
      required: [true, "Silahkan isi posisi anda"],
      maxlength: 100,
    },
    status: {
      type: String,
      enum: ["interview", "declined", "pending"],
      default: "pending",
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "user tidak ada"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", JobSchema);
