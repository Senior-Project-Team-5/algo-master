import { NextRequest, NextResponse } from "next/server";
import db from "@/db";
import { userExamTable } from "@/db/schema";
import { getCachedUserId } from "@/db/queries";

export async function POST(req: NextRequest) {
    try {

        const userId = await getCachedUserId();

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const {exam_topic, score, pass, correct_answers, incorrect_answers, language} = await req.json();
        console.log(userId, exam_topic, score, pass, correct_answers, incorrect_answers, language);

        const accuracyPercentage = Math.round((correct_answers / (correct_answers + incorrect_answers)) * 100);

        const currentProgress = await db.insert(userExamTable).values({
            user_id: userId,
            exam_topic: exam_topic,
            score: score,
            pass: pass,
            correct_answers: correct_answers,
            incorrect_answers: incorrect_answers,
            accuracy_percentage: accuracyPercentage,
            language: language,
        }).returning()

        console.log("Saved user exam progress:", currentProgress);

        return NextResponse.json({ success: true, currentProgress });

    } catch (error) {
        console.error("Error saving user exam progress:", error);
        return NextResponse.json({ error: "Failed to save user exam progress" }, { status: 500 });
    }
}