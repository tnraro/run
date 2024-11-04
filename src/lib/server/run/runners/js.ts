import { Script } from 'node:vm';
import { RunnerError, type IRunner } from '../runner';

export const js: IRunner<'js'> = {
	language: 'js',
	run: async (code, inputs) => {
		try {
			const script = new Script(code);

			return inputs.map((i) => {
				const output: string[] = [];
				const context = createContext(i.input, output);

				const t0 = performance.now();
				script.runInNewContext(context, {
					timeout: 5000
				});
				const time = Math.round(performance.now() - t0);

				return {
					id: i.id,
					output: output.join(''),
					time
				};
			});
		} catch (error) {
			if (error instanceof Error) {
				throw new RunnerError(error.message, error);
			}
			console.error(error);
			throw new RunnerError('Unknown error', error);
		}
	}
};

function createContext(stdin: string, output: string[]) {
	return {
		require: (name: 'fs') => {
			if (name !== 'fs') throw new Error(`Cannot require ${name}`);
			return {
				readFileSync: (path: number) => {
					if (path !== 0) throw new Error(`Cannot read file ${path}`);
					return stdin;
				}
			};
		},
		process: {
			stdout: {
				write: (data: string) => output.push(data)
			}
		},
		console: {
			log: (...args: unknown[]) => {
				output.push(args.map((a) => String(a)).join(' ') + '\n');
			}
		}
	};
}
