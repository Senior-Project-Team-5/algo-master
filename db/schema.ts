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

export const userAchievementTable = pgTable("user_achievement", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userID: text()
    .notNull()
    .default(sql`requesting_user_id()`),
  units_completed: integer().notNull().default(0),
  total_correct: integer().notNull().default(0),
  total_incorrect: integer().notNull().default(0),
});

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
  num_correct: integer().notNull().default(0),
  num_incorrect: integer().notNull().default(0),
  date_completed: date(),
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

export const timedModeDurationEnum = pgEnum("timed_mode_duration", [
  "FIVE_MINUTES",
  "TEN_MINUTES",
  "TWENTY_MINUTES",
]);

export const userTimedModeTable = pgTable("user_timed_mode", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userID: text()
    .notNull()
    .default(sql`requesting_user_id()`),
  duration: timedModeDurationEnum().notNull(),
  date_taken: date()
    .notNull()
    .default(sql`CURRENT_DATE`),
  correct_answers: integer().notNull().default(0),
  incorrect_answers: integer().notNull().default(0),
  accuracy_percentage: integer().notNull().default(0),
  points: integer().notNull().default(0),
  topics_covered: text().array(),
});

export const difficulties = pgEnum("difficulties", ["Easy", "Medium", "Hard", "Expert"])

export const userInfiniteModeTable = pgTable("user_infinite_mode", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userID: text().notNull().default(sql`requesting_user_id()`),
    difficulty: difficulties().notNull(),
    date_taken: date().notNull().default(sql`CURRENT_DATE`),
    points: integer().notNull().default(0),
    correct_answers: integer().notNull().default(0),
    incorrect_answers: integer().notNull().default(0),
    accuracy_percentage: integer().notNull().default(0),
    language: text(),
})

