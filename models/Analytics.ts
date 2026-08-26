import mongoose, { Schema, model, models } from "mongoose";

const AnalyticsSchema = new Schema({
    event_type: { type: String, required: true }, // e.g., 'page_view', 'button_click', 'telegram_success'
    device: { type: String, default: "Unknown" }, // 'iOS', 'Android', 'Desktop'
    user_agent: { type: String, default: "" },
    created_at: { type: Date, default: Date.now },
});

export const Analytics = models.Analytics || model("Analytics", AnalyticsSchema);