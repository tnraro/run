export function storable<T>(key: string, initialState: T) {
	type Listener = (value: T) => void;
	const listneners = new Set<Listener>();
	let data: T = (() => {
		const t = localStorage.getItem(key);
		return t != null ? JSON.parse(t) : initialState;
	})();

	return {
		subscribe,
		set,
		update,
		get value() {
			return data;
		}
	};
	function subscribe(listener: Listener) {
		listneners.add(listener);
		return () => {
			listneners.delete(listener);
		};
	}
	function set(value: T) {
		data = value;
		localStorage.setItem(key, JSON.stringify(data));
		listneners.forEach((l) => l(data));
	}
	function update(map: (value: T) => T) {
		set(map(data));
	}
}
