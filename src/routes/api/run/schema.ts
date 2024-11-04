import { runners, type RunnerName } from '$lib/server/run';
import { z } from 'zod';

export const formSchema = z.object({
	lang: z.enum(runners.map((r) => r.language) as RunnerName).default('cpp'),
	code: z.string(),
	testcases: z
		.array(
			z.object({
				id: z.string(),
				input: z.string()
			})
		)
		.min(1)
});

export type FormSchema = typeof formSchema;
