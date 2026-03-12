import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";
import { Record } from "@/lib/types";

const DATA_FILE = path.join(process.cwd(), "data", "records.json");
const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

function readRecords(): Record[] {
  if (!fs.existsSync(DATA_FILE)) return [];
  const content = fs.readFileSync(DATA_FILE, "utf-8");
  return JSON.parse(content) as Record[];
}

function writeRecords(records: Record[]): void {
  fs.writeFileSync(DATA_FILE, JSON.stringify(records, null, 2));
}

export async function GET(): Promise<NextResponse> {
  const records = readRecords();
  return NextResponse.json(records);
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const formData = await request.formData();

  const title = formData.get("title");
  const description = formData.get("description");
  const image = formData.get("image");

  if (!title || typeof title !== "string") {
    return NextResponse.json({ error: "title is required" }, { status: 400 });
  }
  if (!description || typeof description !== "string") {
    return NextResponse.json(
      { error: "description is required" },
      { status: 400 }
    );
  }
  if (!image || !(image instanceof File)) {
    return NextResponse.json({ error: "image is required" }, { status: 400 });
  }

  const id = uuidv4();
  const ext = image.name.split(".").pop() ?? "bin";
  const filename = `${id}.${ext}`;
  const filePath = path.join(UPLOADS_DIR, filename);

  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }

  const buffer = Buffer.from(await image.arrayBuffer());
  fs.writeFileSync(filePath, buffer);

  const newRecord: Record = {
    id,
    imageUrl: `/uploads/${filename}`,
    title,
    description,
    createdAt: new Date().toISOString(),
  };

  const records = readRecords();
  records.push(newRecord);
  writeRecords(records);

  return NextResponse.json(newRecord, { status: 201 });
}
