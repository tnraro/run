import { json } from '@sveltejs/kit';
import { formSchema } from './schema.js';
export interface ApiPResponse {
	testcases: PromiseSettledResult<{
		id: string;
		output: string;
		time: number;
	}>[];
}
export async function POST({ request }) {
	const body = formSchema.parse(await request.json());

	const a = await run();

	return json(a);

	async function run() {
		await compile();
		const testcases = await Promise.allSettled(body.testcases.map((tc) => run(tc.id, tc.input)));
		return {
			testcases
		};
		async function run(id: string, input: string) {
			const time = (Math.random() * 100) | 0;
			await new Promise((r) => setTimeout(r, time));
			return { id, output: input + '\n', time };
		}
		function compile() {
			return new Promise((r) => setTimeout(r, 1000));
		}
	}
}
