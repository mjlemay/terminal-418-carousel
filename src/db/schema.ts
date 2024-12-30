import { timestamp, serial, text, pgTable } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const scans = pgTable('scans', {
	id: serial('id').primaryKey(),
    scan_id: text(),
    created_at: timestamp().defaultNow(),
});

export const users = pgTable('users', {
	id: serial('id').primaryKey(),
    user_id: text().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
	posts: many(scans),
}));

export const scansRelations = relations(scans, ({ one }) => ({
	author: one(users, { fields: [scans.id], references: [users.id] }),
}));