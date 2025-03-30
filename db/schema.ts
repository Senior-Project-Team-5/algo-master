import { sql } from "drizzle-orm";
import {
  integer,
  pgTable,
  varchar,
  text,
  boolean,
  date,
  pgEnum,
  uuid,
  vector,
  jsonb,
} from "drizzle-orm/pg-core";

// Create achievement history tables

export const topicCategoryEnum = pgEnum("topic_category", [
  "ARRAYS_AND_STRINGS",
  "HASHMAPS_AND_SETS",
  "STACKS_AND_QUEUES",
  "LINKED_LISTS",
  "BINARY_SEARCH",
  "SLIDING_WINDOW",
  "TREES",
  "HEAPS",
  "BACKTRACKING",
  "GRAPHS",
  "DYNAMIC_PROGRAMMING",
]);

export const documents = pgTable("documents", {
  id: uuid("id").primaryKey().defaultRandom(),
  content: text("content").notNull(),
  metadata: jsonb("metadata"),
  embedding: vector("embedding", { dimensions: 768 }), // Match embedding model dimensions
});

export const topicsTable = pgTable("topics", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  topic_category: topicCategoryEnum().notNull(),
  section_name: text().notNull(),
  section_id: varchar({ length: 255 }).notNull().unique(),
  prerequisite_id: varchar({ length: 255 }),
  points_required: integer().notNull().default(10),
});

export const userProgressTable = pgTable("user_progress", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userID: text()
    .notNull()
    .default(sql`requesting_user_id()`),
  topic_section: varchar({ length: 255 }).notNull(),
  points: integer().notNull().default(0),
  completed: boolean().notNull().default(false),
});

export const quizStatus = pgEnum("quiz_status", [
  "NOT_STARTED",
  "IN_PROGRESS",
  "COMPLETED",
]);

export const userRoadmapHistoryTable = pgTable("user_roadmap_history", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userID: text()
    .notNull()
    .default(sql`requesting_user_id()`),
  quiz_topic: varchar({ length: 255 }).notNull(),
  date_taken: date()
    .notNull()
    .default(sql`CURRENT_DATE`),
  correct_answers: integer().notNull().default(0),
  incorrect_answers: integer().notNull().default(0),
  accuracy_percentage: integer().notNull().default(0),
  points: integer().notNull().default(0),
  quiz_status: quizStatus().notNull().default("IN_PROGRESS"),
});

/* 
Database to store user history on previous completed timed mode quizzes' statistics,
including userID, specific rank, date taken, the number of correct answers, 
the number of incorrect answers, accuracy percentage (# of correct answers / total questions * 100),
and points earned.

userID: text, foreign key referencing Users.id (from Clerk)
rank: varchar
date_taken: date
correct_answers: integer
incorrect_answers: integer
accuracy_percentage: integer
points_earned: integer
*/

/* 
Database to store user history on previous completed infinite mode quizzes' statistics,
including userID, specific rank, date taken, the number of correct answers, 
the number of incorrect answers, accuracy percentage (# of correct answers / total questions * 100),
points earned, and the time interval (started at and ended at) for the session of the quiz.

userID: text, foreign key referencing Users.id (from Clerk)
rank: varchar
date_taken: date
correct_answers: integer
incorrect_answers: integer
accuracy_percentage: integer
points_earned: integer
started_at: timestamp
ended_at: timestamp
*/
