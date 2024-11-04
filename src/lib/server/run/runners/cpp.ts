import { parallel } from '$lib/utils/parallel';
import { writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { RunnerError, type IRunner } from '../runner';
import { spawn } from '../spawn';

export const cpp: IRunner<'cpp'> = {
	language: 'cpp',
	run: async (code, inputs) => {
		const OUT_PATH = resolve(tmpdir(), 'a.out');
		const CODE_PATH = resolve(tmpdir(), 'code.cpp');

		await writeFile(CODE_PATH, code);
		const res = await spawn({
			command: 'g++',
			args: [
				CODE_PATH,
				'-o',
				OUT_PATH,
				'-Wall',
				'-Wextra',
				'-Wconversion',
				'-Wno-unused-variable',
				'-O3',
				'-g0',
				'-std=c++17',
				// '-fsanitize=address',
				'-fsanitize=undefined',
				'-fstack-protector'
			],
			timeout: 600000
		});

		if (res.code != 0 || res.signal != null) {
			throw new RunnerError(res.output, res);
		}

		return await parallel(
			inputs.map(async ({ id, input }) => {
				try {
					const res = await spawn({
						command: OUT_PATH,
						args: [],
						stdin: input,
						timeout: 5000
					});
					return {
						id,
						output: res.signal == null ? res.output : res.signal,
						time: res.time
					};
				} catch (error) {
					return {
						id,
						output: String(error),
						time: -1
					};
				}
			})
		);
	}
};
