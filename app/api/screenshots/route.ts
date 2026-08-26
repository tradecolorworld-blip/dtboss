export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import mongoose from "mongoose";

const ScreenshotSchema = new mongoose.Schema({ url: String, created_at: { type: Date, default: Date.now } });
const Screenshot = mongoose.models.Screenshot || mongoose.model("Screenshot", ScreenshotSchema);

const SettingsSchema = new mongoose.Schema({}, { strict: false });
const Settings = mongoose.models.Settings || mongoose.model("Settings", SettingsSchema);

async function verifyAdmin(pass: string) {
  const settings = await Settings.findOne({});
  const currentPass = settings?.adminPass || process.env.ADMIN_PASSWORD || "vssas2000";
  return pass === currentPass;
}

export async function GET() {
  await connectToDatabase();
  const screenshots = await Screenshot.find({}).sort({ created_at: -1 });
  return NextResponse.json({ success: true, screenshots });
}

export async function POST(req: Request) {
  await connectToDatabase();
  const body = await req.json();
  if (!(await verifyAdmin(body.adminPass))) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  
  const newImg = await Screenshot.create({ url: body.url });
  return NextResponse.json({ success: true, image: newImg });
}

export async function DELETE(req: Request) {
  await connectToDatabase();
  const { searchParams } = new URL(req.url);
  if (!(await verifyAdmin(searchParams.get("adminPass") || ""))) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  
  await Screenshot.findByIdAndDelete(searchParams.get("id"));
  return NextResponse.json({ success: true });
}