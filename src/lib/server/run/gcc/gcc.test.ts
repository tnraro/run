import { describe, it, expect } from 'vitest';
import { buildAndRun } from './index';

describe('a+b', () => {
	const code = `#include <bits/stdc++.h>
using namespace std;
using ll = long long;

void solve() {
  int a, b;
  cin >> a >> b;
  cout << a + b << '\\n';
}

signed main() {
  cin.tie(nullptr)->sync_with_stdio(false);
  solve();
}`;

	const testcases = [
		{
			id: 'a',
			input: `5 3`,
			output: '8\n'
		},
		{
			id: 'b',
			input: `1000000000 -999999999`,
			output: '1\n'
		},
		{
			id: 'c',
			input: `50 3`,
			output: '53\n'
		}
	];
	it('buildAndRun', async () => {
		const expected = await buildAndRun(code, testcases);
		expect(
			expected.map((x) => ({
				id: x.id,
				output: x.output
			}))
		).toStrictEqual(
			testcases.map((tc) => ({
				id: tc.id,
				output: tc.output
			}))
		);
	});
});
