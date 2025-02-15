import { timestamp, serial, text, pgTable, date } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const scans = pgTable('scans', {
	id: serial('id').primaryKey(),
    scan_id: text(),
	device_id: text(),
	meta: text(),
    created_at: timestamp().defaultNow(),
});

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  user_id: text().notNull(),
});

export const vinhGame = pgTable('vinhGame', {
  id: serial('id'),
  scan_date: text().notNull().primaryKey(),
  tag_id: text().notNull().primaryKey(),
  node_id: text().notNull().primaryKey(),
  extra: text(),
  created_at: timestamp().defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  posts: many(scans),
}));

export const scansRelations = relations(scans, ({ one }) => ({
  author: one(users, { fields: [scans.id], references: [users.id] }),
}));
