import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { sql } from 'drizzle-orm';
import { config } from "dotenv";
import { 
  topicsTable, 
  userProgressTable, 
  userRoadmapHistoryTable 
} from '@/db/schema';

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

type TopicCategory = 
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
  | "DYNAMIC_PROGRAMMING";

// Combined topic sections data
const topicSectionsData: { topic_category: TopicCategory, section_name: string, section_id: string, prerequisite_id: string | null }[] = [
  // Arrays and Strings
  { topic_category: "ARRAYS_AND_STRINGS", section_name: "Introduction to Strings & Arrays", section_id: "1.1", prerequisite_id: null },
  { topic_category: "ARRAYS_AND_STRINGS", section_name: "Array & String Manipulation", section_id: "1.2", prerequisite_id: "1.1" },
  { topic_category: "ARRAYS_AND_STRINGS", section_name: "Array & String Algorithms", section_id: "1.3", prerequisite_id: "1.2" },

  // Hashmaps and Sets
  { topic_category: "HASHMAPS_AND_SETS", section_name: "Introduction to Hashmaps & Sets", section_id: "2.1", prerequisite_id: "1.3" },
  { topic_category: "HASHMAPS_AND_SETS", section_name: "Hashmaps & Sets Manipulation", section_id: "2.2", prerequisite_id: "2.1" },
  { topic_category: "HASHMAPS_AND_SETS", section_name: "Hashmaps & Sets Algorithms", section_id: "2.3", prerequisite_id: "2.2" },

  // Stacks and Queues
  { topic_category: "STACKS_AND_QUEUES", section_name: "Introduction to Stacks & Queues", section_id: "3.1", prerequisite_id: "2.3" },
  { topic_category: "STACKS_AND_QUEUES", section_name: "Stacks & Queues Manipulation", section_id: "3.2", prerequisite_id: "3.1" },
  { topic_category: "STACKS_AND_QUEUES", section_name: "Stacks & Queues Algorithms", section_id: "3.3", prerequisite_id: "3.2" },

  // Linked Lists
  { topic_category: "LINKED_LISTS", section_name: "Introduction to Linked Lists", section_id: "4.1", prerequisite_id: "3.3" },
  { topic_category: "LINKED_LISTS", section_name: "Linked List Operations", section_id: "4.2", prerequisite_id: "4.1" },
  { topic_category: "LINKED_LISTS", section_name: "Linked List Algorithms", section_id: "4.3", prerequisite_id: "4.2" },

  // Binary Search
  { topic_category: "BINARY_SEARCH", section_name: "Introduction to Binary Search", section_id: "5.1", prerequisite_id: "4.3" },
  { topic_category: "BINARY_SEARCH", section_name: "Binary Search Algorithms", section_id: "5.2", prerequisite_id: "5.1" },

  // Sliding Window
  { topic_category: "SLIDING_WINDOW", section_name: "Introduction to Sliding Window", section_id: "6.1", prerequisite_id: "5.2" },
  { topic_category: "SLIDING_WINDOW", section_name: "Sliding Window Algorithms", section_id: "6.2", prerequisite_id: "6.1" },

  // Trees
  { topic_category: "TREES", section_name: "Introduction to Trees", section_id: "7.1", prerequisite_id: "6.2" },
  { topic_category: "TREES", section_name: "Tree Traversal", section_id: "7.2", prerequisite_id: "7.1" },

  // Heaps
  { topic_category: "HEAPS", section_name: "Introduction to Heaps", section_id: "8.1", prerequisite_id: "7.2" },
  { topic_category: "HEAPS", section_name: "Heap Operations", section_id: "8.2", prerequisite_id: "8.1" },

  // Backtracking
  { topic_category: "BACKTRACKING", section_name: "Introduction to Backtracking", section_id: "9.1", prerequisite_id: "8.2" },
  { topic_category: "BACKTRACKING", section_name: "Backtracking Algorithms", section_id: "9.2", prerequisite_id: "9.1" },

  // Graphs
  { topic_category: "GRAPHS", section_name: "Introduction to Graphs", section_id: "10.1", prerequisite_id: "9.2" },
  { topic_category: "GRAPHS", section_name: "Graph Algorithms", section_id: "10.2", prerequisite_id: "10.1" },

  // Dynamic Programming
  { topic_category: "DYNAMIC_PROGRAMMING", section_name: "Introduction to Dynamic Programming", section_id: "11.1", prerequisite_id: "10.2" },
  { topic_category: "DYNAMIC_PROGRAMMING", section_name: "Dynamic Programming Algorithms", section_id: "11.2", prerequisite_id: "11.1" },
];

// Seed topic sections data
async function seedTopicSections() {
  try {
    await db.insert(topicsTable).values(topicSectionsData);
    console.log('Topic sections seeded successfully');
  } catch (error) {
    console.error('Error seeding topic sections:', error);
  }
}

// Seed userProgressTable data
const userProgressData = [
  {
    userID: "user_2tKW8eexbibGbCNXeAE9sR0swby",
    topic_section: "1.1",
    points: 10,
    completed: true
  },
  {
    userID: "user_2tKW8eexbibGbCNXeAE9sR0swby",
    topic_section: "1.2",
    points: 10,
    completed: true
  },
  {
    userID: "user_2tKW8eexbibGbCNXeAE9sR0swby",
    topic_section: "1.3",
    points: 2,
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
    userID: "user_2tKW8eexbibGbCNXeAE9sR0swby",
    quiz_topic: "1.1",
    correct_answers: 8,
    incorrect_answers: 2,
    accuracy_percentage: 80,
    points: 6,
    quiz_status: 'COMPLETED' as const
  },
  {
    userID: "user_2tKW8eexbibGbCNXeAE9sR0swby",
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
  await seedTopicSections();
  await seedUserProgress();
  await seedUserHistory();
  await client.end();
}

main().catch(console.error);