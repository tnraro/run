export type IRunnerResult = {
	id: string;
	output: string;
	time: number;
}[];

export interface IRunner<L extends string> {
	readonly language: L;
	readonly run: (
		code: string,
		inputs: {
			id: string;
			input: string;
		}[]
	) => Promise<IRunnerResult>;
}

export class RunnerError extends Error {
	constructor(message: string, cause: unknown) {
		super(message);
		this.cause = cause;
	}
}
