export function psTrim(s: string) {
	return s
		.trim()
		.split('\n')
		.map((l) => l.trim())
		.join('\n');
}

export function psCompare(a: string, b: string) {
	if (a === b) return true;
	return psTrim(a) === psTrim(b);
}
