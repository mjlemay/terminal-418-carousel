CREATE TABLE "factoryGame" (
	"id" serial PRIMARY KEY NOT NULL,
	"map_name" text,
	"tile_name" text,
	"meta" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
