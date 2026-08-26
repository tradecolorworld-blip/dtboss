export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import mongoose from "mongoose";

// Dynamic schema to avoid errors
const SettingsSchema = new mongoose.Schema({}, { strict: false });
const Settings = mongoose.models.Settings || mongoose.model("Settings", SettingsSchema);

export async function GET() {
  try {
    await connectToDatabase();
    let settings = await Settings.findOne({});
    if (!settings) settings = await Settings.create({});
    
    const safeSettings = settings.toObject();
    
    // 🔒 VITAL SECURITY: Delete the password from the object before sending to the public frontend!
    delete safeSettings.adminPass;

    return NextResponse.json({ success: true, settings: safeSettings });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();
    
    let settings = await Settings.findOne({});
    
    // Get the current password from DB, fallback to env, fallback to default
    const currentPass = settings?.adminPass || process.env.ADMIN_PASSWORD || "vssas2000";

    // 🔒 LOGIN CHECK (Used by the Admin Panel to verify password securely)
    if (body.action === "login") {
      if (body.adminPass === currentPass) return NextResponse.json({ success: true });
      return NextResponse.json({ success: false, error: "Invalid Password" }, { status: 401 });
    }

    // Ensure they are actually an admin before allowing them to save settings
    if (body.adminPass !== currentPass) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { adminPass, newAdminPass, action, ...updateData } = body;

    // 🔒 CHANGE PASSWORD LOGIC
    if (newAdminPass && newAdminPass.trim() !== "") {
      updateData.adminPass = newAdminPass.trim();
    }

    await Settings.findOneAndUpdate({}, { $set: updateData }, { new: true, upsert: true });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}