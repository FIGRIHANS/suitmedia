import { NextResponse } from "next/server";
import ideasData from "@/data/ideas.json"; // Buat file data di src/data/ideas.json

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  // Pastikan id valid
  if (!id) {
    return NextResponse.json({ message: "ID is required" }, { status: 400 });
  }

  // Cari data sesuai id
  const idea = ideasData.find((item) => String(item.id) === String(id));
  if (!idea) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  return NextResponse.json(idea);
}