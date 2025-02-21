import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { topicsTable, userProgressTable, userRoadmapHistoryTable } from '@/db/schema';
import { config } from "dotenv";


config({ path: ".env.local" });

if (!process.env.DATABASE_URL) {
  console.log(process.env.DATABASE_URL);
  throw new Error('DATABASE_URL environment variable is required');
}

const client = postgres(process.env.DATABASE_URL);
const db = drizzle(client);


// Clear tables
async function clearTables() {
  try {
    await db.delete(topicsTable);
    await db.delete(userProgressTable);
    await db.delete(userRoadmapHistoryTable);
    console.log('Tables cleared successfully');
  } catch (error) {
    console.error('Error clearing tables:', error);
  }
}


// Seed topicsTable data
const topicsData = [
  // Arrays
  { topic_name: "Introduction to Arrays", section_id: "1.1", prerequisite_id: null },
  { topic_name: "Array Manipulation", section_id: "1.2", prerequisite_id: "1.1" },
  { topic_name: "Array Algorithms", section_id: "1.3", prerequisite_id: "1.2" },
  
  // Linked Lists
  { topic_name: "Introduction to Linked Lists", section_id: "2.1", prerequisite_id: "1.3" },
  { topic_name: "Linked List Operations", section_id: "2.2", prerequisite_id: "2.1" },
  { topic_name: "Linked List Algorithms", section_id: "2.3", prerequisite_id: "2.2" },
  
  // Trees
  { topic_name: "Binary Trees Basics", section_id: "3.1", prerequisite_id: "2.3" },
  { topic_name: "Tree Traversal", section_id: "3.2", prerequisite_id: "3.1" }
];

async function seedTopics() {
  try {
    await db.insert(topicsTable).values(topicsData);
    console.log('topicsTable seeded successfully');
  } catch (error) {
    console.error('Error seeding topics:', error);
  }
}



// Seed userProgressTable data
const userProgressData = [
  {
    userID: "user_2r8wGXeRkeQIcIlL5znISK5EKrz",
    topic_section: "1.1",
    completed: true
  },
  {
    userID: "user_2r8wGXeRkeQIcIlL5znISK5EKrz",
    topic_section: "1.2",
    completed: false
  }
];

async function seedUserProgress() {
  try{
    await db.insert(userProgressTable).values(userProgressData)
    console.log('userProgressTable seeded successfully');
  } catch (error) {
    console.error('Error seeding userRoadmapHistory:', error);
  }
}



// Seed userRoadmapHistoryTable data
const userHistoryData = [
  {
    userID: "user_2r8wGXeRkeQIcIlL5znISK5EKrz",
    quiz_topic: "1.1",
    correct_answers: 8,
    incorrect_answers: 2,
    accuracy_percentage: 80,
    points: 6,
    quiz_status: 'COMPLETED' as const
  },
  {
    userID: "user_2r8wGXeRkeQIcIlL5znISK5EKrz",
    quiz_topic: "1.2",
    correct_answers: 3,
    incorrect_answers: 1,
    accuracy_percentage: 75,
    points: 2,
    quiz_status: 'IN_PROGRESS' as const
  }
];

async function seedUserHistory() {
  try {
    await db.insert(userRoadmapHistoryTable).values(userHistoryData);
    console.log('userRoadmapHistoryTable seeded successfully');
  } catch (error) {
    console.error('Error seeding userRoadmapHistory:', error);
  }
}

async function main() {
  
  await clearTables();
  await seedTopics();
  await seedUserProgress();
  await seedUserHistory();
  await client.end();
}


main().catch(console.error);