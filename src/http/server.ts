import { fastify } from 'fastify'
import {
	serializerCompiler,
	validatorCompiler,
	type ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { createGoal } from '../functions/create-goal'
import z from 'zod'

const app = fastify().withTypeProvider<ZodTypeProvider>()
const PORT = 3333

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.post(
	'/goals',
	{
		schema: {
			body: z.object({
				title: z.string(),
				desiredWeeklyFrequency: z.number().int().min(1).max(7),
			}),
		},
	},
	async request => {
		const { title, desiredWeeklyFrequency } = request.body

		await createGoal({
			title,
			desiredWeeklyFrequency,
		})
	}
)

app
	.listen({
		port: PORT,
	})
	.then(() => {
		console.log(`Server running at https://${PORT}`)
	})
