CREATE TABLE "user_achievement" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "user_achievement_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"userID" text DEFAULT requesting_user_id() NOT NULL,
	"units_completed" integer DEFAULT 0 NOT NULL
);
