function solve() {
  const [a, b] = input();
  return;
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
      process.stdout.write(`${x.join(" ")}\n`);
    } else {
      process.stdout.write(`${x}\n`);
    }
  }
}
/**
 * @template [T=number]
 * @param {string | RegExp} splitMethod
 * @param {(x: string) => T} map
 * @returns {T[] | null}
 */
function input(splitMethod = /\s+/g, map = Number) {
  const next = gen.next();
  return next.done ? null : next.value.split(splitMethod).map(map);
}
function* reader(splitMethod = /\s+/g, map = Number) {
  for (const x of gen) {
    yield x.split(splitMethod).map(map);
  }
}
function* _inputGenerator() {
  const { readFileSync } = require("fs");
  const buf = readFileSync(0);
  for (const line of buf.toString().split(/\r?\n/g)) {
    if (line.length > 0) yield line;
  }
}
