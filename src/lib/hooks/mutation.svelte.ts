export enum MutationState {
	Idle,
	Pending,
	Success,
	Error
}
export class Mutation<T, M> {
	#state = $state<MutationState>(MutationState.Idle);
	#data = $state<T | unknown>();
	#fn;
	constructor(fn: (a: M) => Promise<T>) {
		this.#fn = fn;
	}
	async mutate(mutation: M) {
		if (this.#state === MutationState.Pending) throw new Error('Mutation is already pending');
		this.#state = MutationState.Pending;
		try {
			this.#data = await this.#fn(mutation);
			this.#state = MutationState.Success;
		} catch (error) {
			this.#data = error;
			this.#state = MutationState.Error;
		}
	}
	get state() {
		return this.#state;
	}
	get isIdle() {
		return this.#state === MutationState.Idle;
	}
	get isPending() {
		return this.#state === MutationState.Pending;
	}
	get isSuccess() {
		return this.#state === MutationState.Success;
	}
	get isError() {
		return this.#state === MutationState.Error;
	}
	get data() {
		return this.#state === MutationState.Success ? (this.#data as T) : undefined;
	}
	get error() {
		return this.#state === MutationState.Error ? (this.#data as unknown) : undefined;
	}
}
