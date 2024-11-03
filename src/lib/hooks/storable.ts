export function storable<T>(key: string, defaultFn: () => T) {
	type Listener = (data: T) => void;
	const listeners = new Set<Listener>();
	return {
		set,
		subscribe,
		update
	};
	function get(): T {
		if (typeof window === 'undefined') return defaultFn();
		const x = localStorage.getItem(key);
		return x != null ? JSON.parse(x) : defaultFn();
	}
	function set(data: T) {
		localStorage.setItem(key, JSON.stringify(data));
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
