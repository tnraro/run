export function clearLocalStorage(key: string) {
	localStorage.removeItem(`${key}:code`);
	localStorage.removeItem(`${key}:code:js`);
	localStorage.removeItem(`${key}:testcases`);
	localStorage.removeItem(`${key}:lang`);
}
