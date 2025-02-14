CREATE TABLE "vinhGame" (
	"id" serial PRIMARY KEY NOT NULL,
	"scan_date": text,
	"tag_id" text,
	"node_id" text,
	"extra" text,
	"created_at" timestamp DEFAULT now()
);
