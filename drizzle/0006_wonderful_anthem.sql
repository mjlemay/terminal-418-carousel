CREATE TABLE "userMeta" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"meta" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
