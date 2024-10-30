// export interface MutationOptions<T, Mutation> {
// 	fn: (mutation: Mutation) => Promise<T>;
// }
export enum MutationState {
	Idle,
	Pending,
	Success,
	Error
}
// export type Mutation<T> =
// 	| {
// 			state: MutationState.Idle;
// 			isIdle: true;
// 			isPending: false;
// 			isSuccess: false;
// 			isError: false;
// 			data: undefined;
// 			error: undefined;
// 	  }
// 	| {
// 			state: MutationState.Pending;
// 			isIdle: false;
// 			isPending: true;
// 			isSuccess: false;
// 			isError: false;
// 			data: undefined;
// 			error: undefined;
// 	  }
// 	| {
// 			state: MutationState.Success;
// 			isIdle: false;
// 			isPending: false;
// 			isSuccess: true;
// 			isError: false;
// 			data: T;
// 			error: undefined;
// 	  }
// 	| {
// 			state: MutationState.Error;
// 			isIdle: false;
// 			isPending: false;
// 			isSuccess: false;
// 			isError: true;
// 			data: undefined;
// 			error: unknown;
// 	  };
// export function mutation<T, M>(options: MutationOptions<T, M>) {
// 	let _state = $state<MutationState>(MutationState.Idle);
// 	let data = $state<T | unknown>();

// 	return {
// 		...({
// 			get state() {
// 				return _state;
// 			},
// 			get isIdle() {
// 				return _state === MutationState.Idle;
// 			},
// 			get isPending() {
// 				return _state === MutationState.Pending;
// 			},
// 			get isSuccess() {
// 				return _state === MutationState.Success;
// 			},
// 			get isError() {
// 				return _state === MutationState.Error;
// 			},
// 			get data() {
// 				return _state === MutationState.Success ? (data as T) : undefined;
// 			},
// 			get error() {
// 				return _state === MutationState.Error ? (data as unknown) : undefined;
// 			}
// 		} as Mutation<T>),
// 		mutate
// 	};

// 	async function mutate(mutation: M) {
// 		if (_state === MutationState.Pending) throw new Error('Mutation is already pending');
// 		_state = MutationState.Pending;
// 		try {
// 			data = await options.fn(mutation);
// 			_state = MutationState.Success;
// 		} catch (error) {
// 			data = error;
// 			_state = MutationState.Error;
// 		}
// 	}
// }

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
