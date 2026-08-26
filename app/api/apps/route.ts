export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { App } from "@/models/App";
import mongoose from "mongoose";

const SettingsSchema = new mongoose.Schema({}, { strict: false });
const Settings = mongoose.models.Settings || mongoose.model("Settings", SettingsSchema);

// Security Helper
async function verifyAdmin(pass: string) {
  const settings = await Settings.findOne({});
  const currentPass = settings?.adminPass || process.env.ADMIN_PASSWORD || "vssas2000";
  return pass === currentPass;
}

export async function GET() {
  try {
    await connectToDatabase();
    const apps = await App.find({}).sort({ rank: 1, created_at: -1 });
    return NextResponse.json({ success: true, apps });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();

    if (!(await verifyAdmin(body.adminPass))) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const newApp = await App.create({
      name: body.name, version: body.version, size: body.size, icon: body.icon, category: body.category || "Games",
      badge: body.badge || "", desc: body.desc || "", specs: typeof body.specs === "string" ? body.specs.split(",").map((s: string) => s.trim()) : body.specs || [],
      dl: body.dl || "", webDl: body.webDl || "", rank: Number(body.rank) || 0, top: Boolean(body.top),
      release_date: body.release_date || new Date().toISOString().split("T")[0],
    });
    return NextResponse.json({ success: true, app: newApp });
  } catch (error: any) { return NextResponse.json({ success: false, error: error.message }, { status: 500 }); }
}

export async function PUT(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();

    if (!(await verifyAdmin(body.adminPass))) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const { id, adminPass, ...updateData } = body;
    if (updateData.specs && typeof updateData.specs === "string") updateData.specs = updateData.specs.split(",").map((s: string) => s.trim());
    if (updateData.rank !== undefined) updateData.rank = Number(updateData.rank) || 0;

    const updatedApp = await App.findByIdAndUpdate(id, { $set: updateData }, { new: true });
    return NextResponse.json({ success: true, app: updatedApp });
  } catch (error: any) { return NextResponse.json({ success: false, error: error.message }, { status: 500 }); }
}

export async function DELETE(req: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    if (!(await verifyAdmin(searchParams.get("adminPass") || ""))) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    await App.findByIdAndDelete(searchParams.get("id"));
    return NextResponse.json({ success: true });
  } catch (error: any) { return NextResponse.json({ success: false, error: error.message }, { status: 500 }); }
}