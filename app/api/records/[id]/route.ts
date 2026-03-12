import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { Record } from "@/lib/types";

const DATA_FILE = path.join(process.cwd(), "data", "records.json");

function readRecords(): Record[] {
  if (!fs.existsSync(DATA_FILE)) return [];
  const content = fs.readFileSync(DATA_FILE, "utf-8");
  return JSON.parse(content) as Record[];
}

function writeRecords(records: Record[]): void {
  fs.writeFileSync(DATA_FILE, JSON.stringify(records, null, 2));
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await params;
  const records = readRecords();
  const index = records.findIndex((r) => r.id === id);

  if (index === -1) {
    return NextResponse.json({ error: "Record not found" }, { status: 404 });
  }

  const [deleted] = records.splice(index, 1);

  // Delete the image file if it exists
  if (deleted.imageUrl) {
    const imagePath = path.join(process.cwd(), "public", deleted.imageUrl);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  }

  writeRecords(records);

  return NextResponse.json({ success: true });
}
