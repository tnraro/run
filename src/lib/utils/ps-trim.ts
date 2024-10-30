export function psTrim(s: string) {
	return s
		.trim()
		.split('\n')
		.map((l) => l.trim())
		.join('\n');
}
