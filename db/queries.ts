import { cache } from "react";
import db from "./index";
import { auth } from "@clerk/nextjs/server";
import { eq, and } from "drizzle-orm";
import { userProgressTable } from "./schema";

export const getUserProgress = cache(async () => {
    const { userId } = await auth();
    // console.log("User ID:", userId)

    if (!userId) {
        return null;
    }

    const data = await db.query.userProgressTable.findMany({
        where: eq(userProgressTable.userID, userId)
    })

    // console.log("Data", data)
    return data
})


export const getOneUserProgress = cache(async (topic_section: string) => {
    const { userId } = await auth();

    if (!userId) {
        return null;
    }

    const data = await db.query.userProgressTable.findFirst({
        where: and(
                eq(userProgressTable.userID, userId),
                eq(userProgressTable.topic_section, topic_section)
            )
    })

    return data
})


export const getTopics = cache(async () => {
    const { userId } = await auth();

    if (!userId) {
        return null;
    }

    const data = await db.query.topicsTable.findMany()

    return data
})

// export const getTopTenUsers = cache(async () => {
//     const { userId } = await auth();
  
//     if (!userId) {
//       return [];
//     }
  
//     const data = await db.query.userProgressTable.findMany({
//       orderBy: (userProgressTable, { desc }) => [desc(userProgressTable.points)],
//       limit: 10,
//       columns: {
//         userId: true,
//         userName: true,
//         userImageSrc: true,
//         points: true,
//       },
//     });
  
//     return data;
//   });