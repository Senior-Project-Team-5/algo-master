ALTER TABLE "user_achievement" ADD COLUMN "total_correct" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "user_achievement" ADD COLUMN "total_incorrect" integer DEFAULT 0 NOT NULL;