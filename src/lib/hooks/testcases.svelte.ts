import { psCompare } from '$lib/utils/ps-trim';
import type { ApiRunResponse } from '../../routes/api/run/+server';
import { MutationState } from './mutation.svelte';

export interface ITestcase {
	id: string;
	input: string;
	output: string;
	state: MutationState;
	receivedOutput?: string;
	time?: number;
}

export class Testcase {
	#parent;
	id = $state('');
	input = $state('');
	output = $state('');
	state = $state(MutationState.Idle);
	receivedOutput = $state<string>();
	time = $state<number>();
	constructor(parent: Testcases, options?: Partial<ITestcase>) {
		this.#parent = parent;
		this.id = options?.id ?? crypto.randomUUID();
		this.input = options?.input ?? '';
		this.output = options?.output ?? '';
		this.state = options?.state ?? MutationState.Idle;
		this.receivedOutput = options?.receivedOutput;
		this.time = options?.time;
	}
	isIdle() {
		return this.state === MutationState.Idle;
	}
	isPending() {
		return this.state === MutationState.Pending;
	}
	isSuccess() {
		return this.state === MutationState.Success;
	}
	isError() {
		return this.state === MutationState.Error;
	}
	is(id: string) {
		return this.id === id;
	}
	setResult(result: { output: string; time: number }) {
		const isSame = psCompare(this.output, result.output);

		this.state = isSame ? MutationState.Success : MutationState.Error;
		this.receivedOutput = result.output;
		this.time = result.time;
	}
	delete() {
		this.#parent.delete(this.id);
	}
	localSnapshot() {
		return {
			id: this.id,
			input: this.input,
			output: this.output
		};
	}
	remoteSnapshot() {
		return {
			id: this.id,
			input: this.input
		};
	}
}

export class Testcases {
	#testcases = $state<Testcase[]>([]);
	constructor() {}
	get isPending() {
		return this.#testcases.some((tc) => tc.isPending());
	}
	get(id: string) {
		return this.#testcases.find((tc) => tc.is(id));
	}
	new(testcases: Partial<ITestcase>[]) {
		this.#testcases = testcases.map((tc) => new Testcase(this, tc));
	}
	add(options?: Partial<ITestcase>) {
		this.#testcases.push(new Testcase(this, options));
	}
	delete(id: string) {
		this.#testcases = this.#testcases.filter((tc) => !tc.is(id));
	}
	setState(state: MutationState, filter?: Set<string>) {
		for (const tc of this.#testcases) {
			if (filter != null && !filter.has(tc.id)) continue;
			tc.state = state;
		}
	}
	setResult(result: ApiRunResponse) {
		const map = new Map(result.map((x) => [x.id, x]));
		for (const tc of this.#testcases) {
			const receivedTestcase = map.get(tc.id);
			if (receivedTestcase == null) continue;
			tc.setResult(receivedTestcase);
		}
	}
	localSnapshot() {
		return this.#testcases.map((tc) => tc.localSnapshot());
	}
	remoteSnapshot(filter?: Set<string>) {
		return this.#testcases
			.filter((tc) => filter == null || filter.has(tc.id))
			.map((tc) => tc.remoteSnapshot());
	}
	filter(fn: (testcase: Testcase) => boolean) {
		return this.#testcases.filter(fn);
	}
	[Symbol.iterator]() {
		return this.#testcases[Symbol.iterator]();
	}
}
