import { NextRequest, NextResponse } from "next/server";
import db from "@/db";
import { userProgressTable, userAchievementTable } from "@/db/schema";
import { eq, and, gt, count, sum } from "drizzle-orm";
import { getCachedUserId } from "@/db/queries";

export async function POST(req: NextRequest) {
  try {
    const userId = await getCachedUserId(); // Get the userId from Clerk

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {score, topicID, completed = false, unitCorrect, unitIncorrect} = await req.json();

    console.log(userId, score, topicID, completed, unitCorrect, unitCorrect);


    // Get current progress
    const existingProgress = await db.query.userProgressTable.findFirst({
      where: and(
        eq(userProgressTable.userID, userId),
        eq(userProgressTable.topic_section, topicID)
      ),
    });

    // If the user achieved 10 points and wants to mark as completed
    if (completed && score >= 10) {
      await db
        .update(userProgressTable)
        .set({
          points: 10,
          completed: true,
          num_correct: unitCorrect,
          num_incorrect: unitIncorrect,
        })
        .where(
          and(
            eq(userProgressTable.userID, userId),
            eq(userProgressTable.topic_section, topicID)
          )
        );
        // Update achievements
        const numUnitsCompleted = await db
        .select({ count: count() })
        .from(userProgressTable)
        .where(and(eq(userProgressTable.userID, userId), eq(userProgressTable.completed, true)));


        console.log(numUnitsCompleted)
        await db
          .update(userAchievementTable)
          .set({ units_completed: numUnitsCompleted[0].count })
          .where(eq(userAchievementTable.userID, userId));
      
        const totalCorrect = await db
        .select({ total: sum(userProgressTable.num_correct) })
        .from(userProgressTable)
        .where(eq(userProgressTable.userID, userId));

        await db
          .update(userAchievementTable)
          .set({ total_correct: Number(totalCorrect[0]?.total) || 0 })
          .where(eq(userAchievementTable.userID, userId));

        const totalIncorrect = await db
        .select({ total: sum(userProgressTable.num_incorrect) })
        .from(userProgressTable)
        .where(eq(userProgressTable.userID, userId));

        await db
          .update(userAchievementTable)
          .set({ total_incorrect: Number(totalIncorrect[0]?.total) || 0 })
          .where(eq(userAchievementTable.userID, userId));

        return NextResponse.json({ success: true, completed: true });
      }

      
      

    // Only update if not completed and new score is higher
    if (existingProgress && !existingProgress.completed && score > existingProgress.points) {
      await db
        .update(userProgressTable)
        .set({
          points: score,
          num_correct: unitCorrect,
          num_incorrect: unitIncorrect,
        })
        .where(
          and(
            eq(userProgressTable.userID, userId),
            eq(userProgressTable.topic_section, topicID)
          )
        );

      return NextResponse.json({ success: true, updated: true });
    }

    // Only upade if new score is not higher and there user got more incorrect questions
    if (existingProgress && !existingProgress.completed && existingProgress.num_incorrect != unitIncorrect){
      await db
      .update(userProgressTable)
      .set({
        num_incorrect: unitIncorrect,
      })
      .where(
        and(
          eq(userProgressTable.userID, userId),
          eq(userProgressTable.topic_section, topicID)
        )
      );

    return NextResponse.json({ success: true, updated: true });
    }

    return NextResponse.json({ success: true, updated: false });
  } catch (error) {
    console.error("Error updating progress:", error);
    return NextResponse.json(
      { error: "Failed to update progress" },
      { status: 500 }
    );
  }
}
