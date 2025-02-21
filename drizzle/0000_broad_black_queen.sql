CREATE TYPE "public"."quiz_status" AS ENUM('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED');--> statement-breakpoint
CREATE TABLE "topics" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "topics_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"topic_name" text NOT NULL,
	"section_id" varchar(255) NOT NULL,
	"prerequisite_id" varchar(255),
	"points_required" integer DEFAULT 10 NOT NULL,
	CONSTRAINT "topics_section_id_unique" UNIQUE("section_id")
);
--> statement-breakpoint
CREATE TABLE "user_progress" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "user_progress_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"userID" text DEFAULT requesting_user_id() NOT NULL,
	"topic_section" varchar(255) NOT NULL,
	"completed" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_roadmap_history" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "user_roadmap_history_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"userID" text DEFAULT requesting_user_id() NOT NULL,
	"quiz_topic" varchar(255) NOT NULL,
	"date_taken" date DEFAULT CURRENT_DATE NOT NULL,
	"correct_answers" integer DEFAULT 0 NOT NULL,
	"incorrect_answers" integer DEFAULT 0 NOT NULL,
	"accuracy_percentage" integer DEFAULT 0 NOT NULL,
	"points" integer DEFAULT 0 NOT NULL,
	"quiz_status" "quiz_status" DEFAULT 'IN_PROGRESS' NOT NULL
);
