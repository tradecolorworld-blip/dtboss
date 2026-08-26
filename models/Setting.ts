import mongoose, { Schema, model, models } from "mongoose";

const SettingSchema = new Schema({
  adminPass: { type: String, default: "vssas2000" },
  metaTitle: { type: String, default: "COLOUR TRADING HACK – Colour Prediction Mod Apk" },
  metaDesc: { type: String, default: "COLOUR TRADING HACK – Colour Prediction Hack | WinGo Hack" },
  metaKeys: { type: String, default: "" },
  notifMsg: { type: String, default: "🚀 NEW DROP: Latest Colour Trading Hack added!" },
  members: { type: String, default: "50,000+" },
  tg: { type: String, default: "https://t.me/modapksh" },
  wa: { type: String, default: "" },
  yt: { type: String, default: "" },
  ig: { type: String, default: "#" },
  
  // Featured App of the week
  featTitle: { type: String, default: "YaarWin Pro Hack" },
  featMeta: { type: String, default: "v1.200.1 · Android + IOS · Paid Version" },
  featSize: { type: String, default: "2MB" },
  featIcon: { type: String, default: "https://i.ibb.co/27DQm1S2/logo.png" },
  featDl: { type: String, default: "https://yaarwinhack.gt.tc/" },
  
  // Announcement popup
  annEnabled: { type: String, default: "0" }, // "1" for on, "0" for off
  annTitle: { type: String, default: "NEW DROP ALERT!" },
  annIcon: { type: String, default: "📢" },
  annBody: { type: String, default: "Fresh apps just dropped. Join our Telegram for instant updates!" },
  annBtnText: { type: String, default: "Join Telegram" },
});

export const Setting = models.Setting || model("Setting", SettingSchema);