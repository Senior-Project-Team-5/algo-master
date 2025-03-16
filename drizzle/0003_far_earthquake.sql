CREATE TYPE "public"."topic_category" AS ENUM('ARRAYS_AND_STRINGS', 'HASHMAPS_AND_SETS', 'STACKS_AND_QUEUES', 'LINKED_LISTS', 'BINARY_SEARCH', 'SLIDING_WINDOW', 'TREES', 'HEAPS', 'BACKTRACKING', 'GRAPHS', 'DYNAMIC_PROGRAMMING');--> statement-breakpoint
CREATE TABLE "topic_sections" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "topic_sections_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"topic_category" "topic_category" NOT NULL,
	"section_name" text NOT NULL,
	"section_id" varchar(255) NOT NULL,
	"prerequisite_id" varchar(255),
	"points_required" integer DEFAULT 10 NOT NULL,
	CONSTRAINT "topic_sections_section_id_unique" UNIQUE("section_id")
);
--> statement-breakpoint
DROP TABLE "topics" CASCADE;