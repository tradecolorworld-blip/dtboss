import mongoose, { Schema, Document } from "mongoose";

export interface IApp extends Document {
  name: string;
  version?: string;
  size?: string;
  icon?: string;
  category?: string;
  badge?: string;
  desc?: string;
  specs?: string[];
  dl?: string;
  webDl?: string;
  rank?: number;
  top?: boolean;
  slug?: string;
  download_count?: number;
  release_date?: string;
  created_at?: Date;
}

const AppSchema = new Schema(
  {
    name: { type: String, required: true },
    version: { type: String, default: "v1.0.0" },
    size: { type: String, default: "5MB" },
    icon: { type: String, default: "" },
    category: { type: String, default: "Games" },
    badge: { type: String, default: "" },
    desc: { type: String, default: "" },
    specs: { type: [String], default: [] },
    dl: { type: String, default: "" },
    webDl: { type: String, default: "" },
    rank: { type: Number, default: 0 },
    top: { type: Boolean, default: false },
    slug: { type: String },
    download_count: { type: Number, default: 0 },
    release_date: { type: String },
    created_at: { type: Date, default: Date.now },
  },
  { 
    strict: false, // Ensures fields never get stripped
    timestamps: false 
  }
);

// Prevent Next.js from caching the stale old schema in dev mode:
if (mongoose.models.App) {
  delete (mongoose.models as any).App;
}

export const App = mongoose.models.App || mongoose.model<IApp>("App", AppSchema);