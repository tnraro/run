import { z } from 'zod';

export const searchSchema = z.object({
	url: z.string().url().min(1)
});

export type SearchSchema = typeof searchSchema;
