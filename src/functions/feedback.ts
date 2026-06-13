import { createServerFn } from '@tanstack/react-start'
import { desc, eq } from 'drizzle-orm'
import { db } from '#/db/index'
import { feedback } from '#/db/schema'

export const getFeedbacks = createServerFn({ method: 'GET' }).handler(async () => {
  return db.select().from(feedback).orderBy(desc(feedback.createdAt))
})

export const submitFeedback = createServerFn({ method: 'POST' })
  .validator((data: { username: string; title: string; body: string }) => data)
  .handler(async ({ data }) => {
    await db.insert(feedback).values({
      username: data.username,
      title: data.title,
      body: data.body,
    })
    return { success: true }
  })

export const updateFeedbackStatus = createServerFn({ method: 'POST' })
  .validator((data: { id: number; status: string }) => data)
  .handler(async ({ data }) => {
    await db
      .update(feedback)
      .set({ status: data.status })
      .where(eq(feedback.id, data.id))
    return { success: true }
  })

export const deleteFeedback = createServerFn({ method: 'POST' })
  .validator((data: { id: number }) => data)
  .handler(async ({ data }) => {
    await db.delete(feedback).where(eq(feedback.id, data.id))
    return { success: true }
  })
