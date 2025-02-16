CREATE TABLE "vinhGame" (
	"id" serial NOT NULL,
	"scan_date" text PRIMARY KEY NOT NULL,
	"tag_id" text PRIMARY KEY NOT NULL,
	"node_id" text PRIMARY KEY NOT NULL,
	"extra" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "meta" text;