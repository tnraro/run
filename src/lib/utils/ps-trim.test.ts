import { describe, it, expect } from 'vitest';
import { psTrim } from './ps-trim';

describe('psTrim', () => {
	it('empty string', () => {
		expect(psTrim('')).toBe('');
	});
	it('whitespace only', () => {
		expect(psTrim('   ')).toBe('');
	});
	it('whitespace with newlines', () => {
		expect(psTrim('    \n  \n \n    ')).toBe('');
	});
	it('keeps non-whitespace', () => {
		expect(psTrim('a b c')).toBe('a b c');
	});
	it('keeps newlines inside', () => {
		expect(psTrim('\na\n\nb\nc\n')).toBe('a\n\nb\nc');
	});
});
