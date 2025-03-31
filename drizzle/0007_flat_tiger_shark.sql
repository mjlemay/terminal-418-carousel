ALTER TABLE "userMeta" RENAME TO "userGameMeta";--> statement-breakpoint
ALTER TABLE "userGameMeta" ADD COLUMN "game" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "updated_at" timestamp DEFAULT now();