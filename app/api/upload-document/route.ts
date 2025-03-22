import { NextRequest, NextResponse } from "next/server";
import { processPDF } from "@/lib/document-processor";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const category = formData.get("category") as string;
    
    if (!file || !category) {
      return NextResponse.json(
        { success: false, error: "Missing file or category" },
        { status: 400 }
      );
    }
    
    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Process the PDF
    const result = await processPDF(buffer, file.name, category);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in upload-document API:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process document" },
      { status: 500 }
    );
  }
}