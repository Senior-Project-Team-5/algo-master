// app/api/timed-quiz/save/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from "@clerk/nextjs/server";
import db from "@/db";
import { userTimedModeTable } from "@/db/schema";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { 
      duration, 
      correct_answers, 
      incorrect_answers, 
      points,
      topics_covered 
    } = body;
    
    // Calculate accuracy percentage
    const total = correct_answers + incorrect_answers;
    const accuracy_percentage = total > 0 ? Math.round((correct_answers / total) * 100) : 0;
    
    // Insert the record
    const result = await db.insert(userTimedModeTable).values({
      userID: userId,
      duration,
      correct_answers,
      incorrect_answers,
      accuracy_percentage,
      points,
      topics_covered
    }).returning();
    
    return NextResponse.json({
      success: true,
      record: result[0]
    });
  } catch (error) {
    console.error("Error saving timed quiz results:", error);
    return NextResponse.json({ error: "Failed to save results" }, { status: 500 });
  }
}