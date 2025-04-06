CREATE TYPE "public"."timed_mode_duration" AS ENUM('FIVE_MINUTES', 'TEN_MINUTES', 'TWENTY_MINUTES');--> statement-breakpoint
CREATE TABLE "user_timed_mode" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "user_timed_mode_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"userID" text DEFAULT requesting_user_id() NOT NULL,
	"duration" timed_mode_duration NOT NULL,
	"date_taken" date DEFAULT CURRENT_DATE NOT NULL,
	"correct_answers" integer DEFAULT 0 NOT NULL,
	"incorrect_answers" integer DEFAULT 0 NOT NULL,
	"accuracy_percentage" integer DEFAULT 0 NOT NULL,
	"points" integer DEFAULT 0 NOT NULL,
	"topics_covered" text[]
);
