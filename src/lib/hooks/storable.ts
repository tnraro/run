export function storable<T>(
	key: string,
	defaultFn: () => T,
	options?: {
		serialize?: (data: T) => string;
		deserialize?: (data: string) => T;
	}
) {
	type Listener = (data: T) => void;
	const listeners = new Set<Listener>();
	const serialize = options?.serialize ?? JSON.stringify;
	const deserialize = options?.deserialize ?? JSON.parse;
	return {
		set,
		subscribe,
		update
	};
	function get(): T {
		if (typeof window === 'undefined') return defaultFn();
		const x = localStorage.getItem(key);
		return x != null ? deserialize(x) : defaultFn();
	}
	function set(data: T) {
		localStorage.setItem(key, serialize(data));
		listeners.forEach((l) => l(data));
	}
	function update(fn: (data: T) => T) {
		set(fn(get()));
	}
	function subscribe(listener: Listener) {
		listener(get());
		listeners.add(listener);
		return () => {
			listeners.delete(listener);
		};
	}
}
