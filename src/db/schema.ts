import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'

export const feedback = pgTable('feedback', {
  id: serial().primaryKey(),
  username: text().notNull().default('ناشناس'),
  title: text().notNull(),
  body: text().notNull(),
  status: text().notNull().default('registered'),
  createdAt: timestamp('created_at').defaultNow(),
})
