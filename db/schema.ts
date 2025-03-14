import { sql } from "drizzle-orm";
import { integer, pgTable, varchar, text, boolean, date, pgEnum, uuid, vector } from "drizzle-orm/pg-core";



export const documents = pgTable('documents', {
    id: uuid('id').primaryKey().defaultRandom(),
    content: text('content').notNull(),
    embedding: vector('embedding', { dimensions: 768 }) // Match embedding model dimensions
  });


/*
Database to store topics for the roadmap quizzes and enable prerequisites for each topic

ID: integer
topic_name: varchar
section_id: unique string (ex. "1.1", "1.2", "2.1", "2.2", etc.)
prerequisite_id: string, foreign key referencing section_id
*/
export const topicsTable = pgTable("topics", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    topic_name: text().notNull(),
    section_id: varchar({ length: 255 }).notNull().unique(),
    prerequisite_id: varchar({ length: 255 }),
    points_required: integer().notNull().default(10),
})


/*
Database to store User Progress on the roadmap quizzes

userID: text, foreign key referencing Users.id (from Clerk)
topic_section: string, foreign key referencing Topics.section_id
completed: boolean

TODO: 
1. In supabase table editor, add default value to requesting_user_id() function to get the user's ID.
2. In supabase table editor, add Auth policies to allow user to insert and select data.
*/
export const userProgressTable = pgTable("user_progress", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userID: text().notNull().default(sql`requesting_user_id()`),
    topic_section: varchar({ length: 255 }).notNull(),
    completed: boolean().notNull().default(false),
})


/* 
Database to store user history on previous completed roadmap quizzes' statistics,
including userID, specific quiz topic name, date taken, the number of correct answers, 
the number of incorrect answers, accuracy percentage (# of correct answers / total questions * 100).

userID: text, foreign key referencing Users.id (from Clerk)
quiz_topic: varchar
date_taken: date
correct_answers: integer
incorrect_answers: integer
accuracy_percentage: integer
*/
export const quizStatus = pgEnum('quiz_status', ['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'])

export const userRoadmapHistoryTable = pgTable("user_roadmap_history", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userID: text().notNull().default(sql`requesting_user_id()`),
    quiz_topic: varchar({ length: 255 }).notNull(),
    date_taken: date().notNull().default(sql`CURRENT_DATE`),
    correct_answers: integer().notNull().default(0),
    incorrect_answers: integer().notNull().default(0),
    accuracy_percentage: integer().notNull().default(0),
    points: integer().notNull().default(0),
    quiz_status: quizStatus().notNull().default('IN_PROGRESS'),
})


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