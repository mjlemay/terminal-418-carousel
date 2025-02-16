import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const vinhGame = pgTable("vinhGame", {
	id: serial().primaryKey().notNull(),
	scanDate: text("scan_date").notNull(),
	tagId: text("tag_id").notNull(),
	nodeId: text("node_id").notNull(),
	extra: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
});

export const users = pgTable("users", {
	id: serial().primaryKey().notNull(),
	userId: text("user_id").notNull(),
	meta: text(),
});

export const scans = pgTable("scans", {
	id: serial().primaryKey().notNull(),
	scanId: text("scan_id"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	deviceId: text("device_id"),
	meta: text(),
});
