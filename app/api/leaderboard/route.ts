// app/api/leaderboard/route.ts
import { NextRequest, NextResponse } from "next/server";
import db from "@/db";
import { userProgressTable, userTimedModeTable, userInfiniteModeTable } from "@/db/schema";
import { eq, count, desc, max } from "drizzle-orm";
import { clerkClient } from "@clerk/nextjs/server";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const type = url.searchParams.get("type") || "roadmap";
    const limit = parseInt(url.searchParams.get("limit") || "10");

    let leaderboardData = [];

    switch (type) {
      case "roadmap":
        // Get users by number of completed topics, keeping only one entry per user
        leaderboardData = await db
          .select({
            userId: userProgressTable.userID,
            completedSections: count(userProgressTable.id),
          })
          .from(userProgressTable)
          .where(eq(userProgressTable.completed, true))
          .groupBy(userProgressTable.userID)
          .orderBy(desc(count(userProgressTable.id)))
          .limit(limit);
        break;

      case "timed-5":
      case "timed-10":
      case "timed-20":
        // Map type to duration enum value
        const durationMap = {
          "timed-5": "FIVE_MINUTES",
          "timed-10": "TEN_MINUTES",
          "timed-20": "TWENTY_MINUTES",
        };
        const duration = durationMap[type as keyof typeof durationMap];

        // Get highest score for each user in this duration
        leaderboardData = await db
          .select({
            userId: userTimedModeTable.userID,
            points: max(userTimedModeTable.points),
            correctAnswers: max(userTimedModeTable.correct_answers),
          })
          .from(userTimedModeTable)
          .where(eq(userTimedModeTable.duration, duration))
          .groupBy(userTimedModeTable.userID)
          .orderBy(desc(max(userTimedModeTable.points)))
          .limit(limit);
        break;

      case "infinite-easy":
      case "infinite-medium":
      case "infinite-hard":
      case "infinite-expert":
        // Map type to difficulty enum value
        const difficultyMap = {
          "infinite-easy": "Easy",
          "infinite-medium": "Medium",
          "infinite-hard": "Hard",
          "infinite-expert": "Expert",
        };
        const difficulty = difficultyMap[type as keyof typeof difficultyMap];

        // Get highest correct answers for each user in this difficulty
        leaderboardData = await db
          .select({
            userId: userInfiniteModeTable.userID,
            correctAnswers: max(userInfiniteModeTable.correct_answers),
            points: max(userInfiniteModeTable.points),
          })
          .from(userInfiniteModeTable)
          .where(eq(userInfiniteModeTable.difficulty, difficulty))
          .groupBy(userInfiniteModeTable.userID)
          .orderBy(desc(max(userInfiniteModeTable.correct_answers)))
          .limit(limit);
        break;

      default:
        return NextResponse.json(
          { error: "Invalid leaderboard type" },
          { status: 400 }
        );
    }

    // Get user profile info from Clerk
    const leaderboard = await Promise.all(
      leaderboardData.map(async (entry, index) => {
        let userName = `User ${index + 1}`;
        let userImageSrc = `/user${(index % 9) + 1}.png`;
        
        try {
          // Fetch user data from Clerk
          const client = await clerkClient()
          const user = await client.users.getUser(entry.userId);
          
          if (user) {
            // Use user's real name or username if available
            userName = user.firstName && user.lastName 
              ? `${user.firstName} ${user.lastName}`
              : user.username || `User ${index + 1}`;
            
            // Use user's profile image if available
            userImageSrc = user.imageUrl || `/user${(index % 9) + 1}.png`;
          }
        } catch (error) {
          console.error(`Error fetching user data for ${entry.userId}:`, error);
          // If we can't fetch user data, fallback to default values
        }
        
        return {
          userId: entry.userId,
          userName,
          userImageSrc,
          points: entry.points || entry.correctAnswers || entry.completedSections || 0,
          position: index + 1,
        };
      })
    );

    return NextResponse.json(leaderboard);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return NextResponse.json(
      { error: "Failed to fetch leaderboard data" },
      { status: 500 }
    );
  }
}