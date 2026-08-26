import mongoose, { Schema, model, models } from "mongoose";

const ScreenshotSchema = new Schema({
  url: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
});

export const Screenshot = models.Screenshot || model("Screenshot", ScreenshotSchema);