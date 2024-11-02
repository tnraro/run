import { spawn } from 'node:child_process';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { writeFile } from 'node:fs/promises';

const OUT_PATH = resolve(tmpdir(), 'a.out');
const CODE_PATH = resolve(tmpdir(), 'code.cpp');

export class GccError extends Error {
	constructor(cause: { output: string }) {
		super(cause.output);
		this.cause = cause;
	}
}

export async function buildAndRun(code: string, inputs: { id: string; input: string }[]) {
	await writeFile(CODE_PATH, code);
	const res = await exec({
		command: 'g++',
		args: [
			CODE_PATH,
			'-o',
			OUT_PATH,
			'-Wall',
			'-Wextra',
			'-O3',
			'-Wconversion',
			'-g0',
			'-std=c++17',
			'-fsanitize=address',
			'-fsanitize=undefined',
			'-fstack-protector',
			'-Wno-unused-variable'
		],
		timeout: 5000
	});

	if (res.code != 0 || res.signal != null) {
		throw new GccError(res);
	}

	const result = [];
	for (const { id, input } of inputs) {
		try {
			const res = await exec({
				command: OUT_PATH,
				args: [],
				stdin: input,
				timeout: 5000
			});
			result.push({
				id,
				output: res.signal == null ? res.output : res.signal,
				time: res.time
			});
		} catch (error) {
			result.push({
				id,
				output: String(error),
				time: -1
			});
		}
	}

	return result;
}

function exec(options: { command: string; args: string[]; stdin?: string; timeout: number }) {
	return new Promise<{
		code: number | null;
		signal: string | null;
		output: string;
		time: number;
	}>((resolve, reject) => {
		const t0 = performance.now();
		const p = spawn(options.command, options.args);
		const output: string[] = [];
		p.stdout.setEncoding('utf8');
		p.stdout.on('data', (chunk) => {
			output.push(chunk);
		});
		p.stderr.setEncoding('utf8');
		p.stderr.on('data', (chunk) => {
			output.push(chunk);
		});
		const timeout = setTimeout(() => {
			p.kill('SIGKILL');
		}, options.timeout);
		if (options.stdin != null) {
			p.stdin.setDefaultEncoding('utf8');
			p.stdin.write(options.stdin);
			p.stdin.end();
		}
		p.on('error', (err) => {
			reject(err);
		});
		p.on('close', (code, signal) => {
			const time = Math.round(performance.now() - t0);
			clearTimeout(timeout);
			resolve({
				code,
				signal,
				output: output.join('\n'),
				time
			});
		});
	});
}
