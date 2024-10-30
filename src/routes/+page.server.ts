import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { searchSchema } from './search/schema';

export const load = async () => {
	return {
		form: await superValidate(zod(searchSchema))
	};
};
