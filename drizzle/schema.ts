import { pgTable, serial, text } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const users = pgTable("users", {
	id: serial().primaryKey().notNull(),
	userId: text("user_id").notNull(),
});
