import { describe, it, expect } from 'vitest';
import { js } from './js';

describe('js', () => {
	it('a+b', async () => {
		const code = `function solve() {
  const [a, b] = input();
  return a + b;
}

// ---
const gen = _inputGenerator();
run(solve);
function run(solve) {
  switch (solve.constructor.name) {
    case "Function":
      return fn();
    case "GeneratorFunction":
      return genFn();
  }
  function fn() {
    log(solve());
  }
  function genFn() {
    const gen = solve();
    let x = gen.next();
    while (!x.done) {
      log(x.value);
      x = gen.next();
    }
    if (x.value != null) log(x.value);
  }
  function log(x) {
    if (Array.isArray(x)) {
      process.stdout.write(\`\${x.join(" ")}\\n\`);
    } else {
      process.stdout.write(\`\${x}\\n\`);
    }
  }
}
/**
 * @template [T=number]
 * @param {string | RegExp} splitMethod
 * @param {(x: string) => T} map
 * @returns {T[] | null}
 */
function input(splitMethod = /\\s+/g, map = Number) {
  const next = gen.next();
  return next.done ? null : next.value.split(splitMethod).map(map);
}
function* reader(splitMethod = /\\s+/g, map = Number) {
  for (const x of gen) {
    yield x.split(splitMethod).map(map);
  }
}
function* _inputGenerator() {
  const { readFileSync } = require("fs");
  const buf = readFileSync(0);
  for (const line of buf.toString().split(/\\r?\\n/g)) {
    if (line.length > 0) yield line;
  }
}
`;
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
		const expected = await js.run(code, testcases);
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
	it('n a*b', async () => {
		const code = `function* solve() {
  const [n] = input();
  for (let i = 0; i < n; ++i) {
    const [a, b] = input();
    yield a * b;
  }
}

// ---
const gen = _inputGenerator();
run(solve);
function run(solve) {
  switch (solve.constructor.name) {
    case "Function":
      return fn();
    case "GeneratorFunction":
      return genFn();
  }
  function fn() {
    log(solve());
  }
  function genFn() {
    const gen = solve();
    let x = gen.next();
    while (!x.done) {
      log(x.value);
      x = gen.next();
    }
    if (x.value != null) log(x.value);
  }
  function log(x) {
    if (Array.isArray(x)) {
      process.stdout.write(\`\${x.join(" ")}\\n\`);
    } else {
      process.stdout.write(\`\${x}\\n\`);
    }
  }
}
/**
 * @template [T=number]
 * @param {string | RegExp} splitMethod
 * @param {(x: string) => T} map
 * @returns {T[] | null}
 */
function input(splitMethod = /\\s+/g, map = Number) {
  const next = gen.next();
  return next.done ? null : next.value.split(splitMethod).map(map);
}
function* reader(splitMethod = /\\s+/g, map = Number) {
  for (const x of gen) {
    yield x.split(splitMethod).map(map);
  }
}
function* _inputGenerator() {
  const { readFileSync } = require("fs");
  const buf = readFileSync(0);
  for (const line of buf.toString().split(/\\r?\\n/g)) {
    if (line.length > 0) yield line;
  }
}
`;
		const testcases = [
			{
				id: 'a',
				input: `1\n5 3`,
				output: '15\n'
			},
			{
				id: 'b',
				input: `2\n5 3\n3 -4`,
				output: '15\n-12\n'
			},
			{
				id: 'c',
				input: `3\n5 3\n3 -4\n50 3`,
				output: '15\n-12\n150\n'
			}
		];
		const expected = await js.run(code, testcases);
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
