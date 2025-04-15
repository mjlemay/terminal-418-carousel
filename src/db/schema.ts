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
	meta: text(),
  created_at: timestamp().defaultNow(),
  updated_at: timestamp().defaultNow(),
});

export const userMeta = pgTable('userGameMeta', {
  id: serial('id').primaryKey(),
  user_id: text().notNull(),
  game: text(),
  meta: text(),
  created_at: timestamp().defaultNow(),
  updated_at: timestamp().defaultNow(),
});

export const vinhGame = pgTable('vinhGame', {
  id: serial('id').primaryKey(),
  scan_date: text().notNull(),
  tag_id: text().notNull(),
  node_id: text().notNull(),
  extra: text(),
  created_at: timestamp().defaultNow(),
});

export const factoryGame = pgTable('factoryGame', {
  id: serial('id').primaryKey(),
  map_name: text(),
  tile_name: text(),
  meta: text(),
  created_at: timestamp().defaultNow(),
  updated_at: timestamp().defaultNow(),
});

