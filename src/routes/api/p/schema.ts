import { z } from 'zod';

export const formSchema = z.object({
	code: z.string(),
	testcases: z.array(z.string()).min(1)
});

export type FormSchema = typeof formSchema;
