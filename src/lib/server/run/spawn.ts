import { spawn as _spawn } from 'node:child_process';

export function spawn(options: {
	command: string;
	args: string[];
	stdin?: string;
	timeout: number;
}) {
	return new Promise<{
		code: number | null;
		signal: string | null;
		output: string;
		time: number;
	}>((resolve, reject) => {
		const t0 = performance.now();
		const p = _spawn(options.command, options.args);
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
