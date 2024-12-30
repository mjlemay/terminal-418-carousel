CREATE TABLE "scans" (
	"id" serial PRIMARY KEY NOT NULL,
	"scan_id" text,
	"created_at" timestamp DEFAULT now()
);
