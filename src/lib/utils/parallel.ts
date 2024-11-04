export function parallel<T>(rest: Promise<T>[]) {
	return Promise.all<T>(rest);
}
