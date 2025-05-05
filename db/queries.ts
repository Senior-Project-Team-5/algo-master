import { cache } from "react";
import db from "./index";
import { auth } from "@clerk/nextjs/server";
import { eq, and } from "drizzle-orm";
import { userProgressTable, topicsTable, userAchievementTable, userTimedModeTable, userInfiniteModeTable, userExamTable } from "./schema";

// Shared function to get userId with caching
export const getCachedUserId = cache(async () => {
  const { userId } = await auth();
  return userId;
});

export const getUserProgress = cache(async () => {
  const userId = await getCachedUserId();
  // console.log("User ID:", userId)

  if (!userId) {
    return null;
  }

  const data = await db.query.userProgressTable.findMany({
    where: eq(userProgressTable.userID, userId),
  });

  // console.log("Data", data)
  return data;
});

export const getUserAchievements = cache(async () => {
  const userId = await getCachedUserId();

  if (!userId) {
    return null;
  }

  const data = await db.query.userAchievementTable.findFirst({
    where: eq(userProgressTable.userID, userId),
  });

  return data;
});

export const getOneUserProgress = cache(async (topic_section: string) => {
  const userId = await getCachedUserId();
  if (!userId) return null;

  const data = await db.query.userProgressTable.findFirst({
    where: and(
      eq(userProgressTable.userID, userId),
      eq(userProgressTable.topic_section, topic_section)
    ),
  });

  return data;
});

export const getUserTimedModeHistory = cache(async () => {
  const userId = await getCachedUserId();

  if (!userId) {
    return null;
  }

  const data = await db.query.userTimedModeTable .findMany({
    where: eq(userTimedModeTable .userID, userId),
  });

  return data;
});

export const getUserInfiniteModeHistory = cache(async () => {
  const userId = await getCachedUserId();

  if (!userId) {
    return null;
  }

  const data = await db.query.userInfiniteModeTable.findMany({
    where: eq(userInfiniteModeTable .userID, userId),
  });

  return data;
});

export const getUserExamHistory = cache(async () => {
  const userId = await getCachedUserId();

  if (!userId) {
    return null;
  }

  const data = await db.query.userExamTable.findMany({
    where: eq(userExamTable .user_id, userId),
  });

  return data;
});
export const getTopicName = cache(async (section_name: string) => {
  const userId = await getCachedUserId();
  if (!userId) return null;

  const data = await db.query.topicsTable.findFirst({
    where: eq(topicsTable.section_name, section_name),
  });

  return data;
});

export const getTopicSections = cache(
  async (
    category:
      | "ARRAYS_AND_STRINGS"
      | "HASHMAPS_AND_SETS"
      | "STACKS_AND_QUEUES"
      | "LINKED_LISTS"
      | "BINARY_SEARCH"
      | "SLIDING_WINDOW"
      | "TREES"
      | "HEAPS"
      | "BACKTRACKING"
      | "GRAPHS"
      | "DYNAMIC_PROGRAMMING"
  ) => {
    const userId = await getCachedUserId();
    if (!userId) return null;

    return db.query.topicsTable.findMany({
      where: eq(topicsTable.topic_category, category),
    });
  }
);

// Helper function to map frontend names to enum values
const getCategoryEnum = (topic_name: string) => {
  switch (topic_name) {
    case "Arrays & Strings":
      return "ARRAYS_AND_STRINGS";
    case "Hashmaps & Sets":
      return "HASHMAPS_AND_SETS";
    case "Stacks & Queues":
      return "STACKS_AND_QUEUES";
    case "Linked Lists":
      return "LINKED_LISTS";
    case "Binary Search":
      return "BINARY_SEARCH";
    case "Sliding Window":
      return "SLIDING_WINDOW";
    case "Trees":
      return "TREES";
    case "Heaps":
      return "HEAPS";
    case "Backtracking":
      return "BACKTRACKING";
    case "Graphs":
      return "GRAPHS";
    case "Dynamic Programming":
      return "DYNAMIC_PROGRAMMING";
    default:
      return null;
  }
};

// Replace all individual topic queries with a single function
export const getTopicData = cache(async (topic_name: string) => {
  const category = getCategoryEnum(topic_name);
  if (!category) return null;
  return getTopicSections(category);
});

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
