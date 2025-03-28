import { NextRequest, NextResponse } from "next/server";
import db from "@/db";
import { userInfiniteModeTable } from "@/db/schema";
import { getCachedUserId } from "@/db/queries";

export async function POST(req: NextRequest) {
    try {
        const userId = await getCachedUserId();

        if(!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { points, difficulty, correct, incorrect } = await req.json();
        console.log(userId, points, difficulty, correct, incorrect);

        const accuracyPercentage = Math.round((correct / (correct + incorrect)) * 100);

        // Save user infinite mode progress
        const currentProgress = await db.insert(userInfiniteModeTable).values({
            userID: userId,
            points: points,
            difficulty: difficulty,
            correct_answers: correct,
            incorrect_answers: incorrect,
            accuracy_percentage: accuracyPercentage,
        }).returning()

        console.log("Saved user infinite mode progress:", currentProgress);

        return NextResponse.json({ success: true, currentProgress });

    } catch (error) {
        console.error("Error saving user infinite mode progress:", error);
        return NextResponse.json({ error: "Failed to save user infinite mode progress" }, { status: 500 });
    }
}
