import { describe, it, expect } from 'vitest';
import { baekjoonAdapter } from './baekjoon';

describe('baekjoon', () => {
	it('test()', () => {
		expect(baekjoonAdapter.test('https://www.acmicpc.net/problem/1003')).toBe(true);
	});
	it('get()', async () => {
		expect(await baekjoonAdapter.get('https://www.acmicpc.net/problem/1003')).toMatchSnapshot();
	});
});
