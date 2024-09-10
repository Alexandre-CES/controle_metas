import dayjs from 'dayjs'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import { db } from '../db'
import { goalCompletions, goals } from '../db/schema'
import { and, count, lte, sql } from 'drizzle-orm'

dayjs.extend(weekOfYear)

export function getWeekPendingGoals() {
	const lastDayOfWeek = dayjs().endOf('week').toDate()

	const goalsCreatedUpToWeek = db.$with('goals_created_up_to_week').as(
		db
			.select({
				id: goals.id,
				title: goals.title,
				desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
				createdAt: goals.createdAt,
			})
			.from(goals)
			.where(lte(goals.createdAt, lastDayOfWeek))
	)

	const goalCompletionCounts = db.$with('goal_completions_counts').as(
		db
			.select({
				goalId: goalCompletions.goalId,
				completionCount: count(goalCompletions.id),
			})
			.from(goalCompletions)
			.groupBy(goalCompletions.goalId)
	)
}
