import { NextRequest, NextResponse } from 'next/server';
import db from '@/db';
import { userProgressTable } from '@/db/schema';
import { eq, and, gt } from 'drizzle-orm';
import { getCachedUserId } from '@/db/queries';

export async function POST(req: NextRequest) {
  try {
    const userId = await getCachedUserId(); // Get the userId from Clerk
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { score, topicID } = await req.json();
    console.log(userId, score, topicID);
    // Get current progress
    const existingProgress = await db.query.userProgressTable.findFirst({
      where: and(
        eq(userProgressTable.userID, userId),
        eq(userProgressTable.topic_section, topicID)
      )
    });

    // Only update if not completed and new score is higher
    if (existingProgress && !existingProgress.completed && score > existingProgress.points) {
      await db.update(userProgressTable)
        .set({ points: score })
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
    return NextResponse.json({ error: "Failed to update progress" }, { status: 500 });
  }
}
