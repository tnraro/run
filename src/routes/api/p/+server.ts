import { json } from '@sveltejs/kit';
import { formSchema } from './schema.js';
export interface ApiPBody {
	testcases: Record<string, { output: string; time: number }>;
}
export async function POST({ request }) {
	const body = formSchema.parse(await request.json());

	console.log(body);
	const a = await run();

	return json(a);

	async function run() {
		await compile();
		return {
			testcases: body.testcases.reduce(
				(acc, input) => {
					acc[input] = {
						output: '3\n2\n1\n',
						time: 53
					};
					return acc;
				},
				{} as ApiPBody['testcases']
			)
		};
		function compile() {
			return new Promise((r) => setTimeout(r, 1000));
		}
	}
}
