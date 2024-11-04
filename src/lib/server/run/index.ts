import type { UnionToTuple } from '$lib/utils/utility-types';
import type { IRunner } from './runner';
import { cpp } from './runners/cpp';
import { js } from './runners/js';

export const runners = [cpp, js] as const;

export type RunnerLanguage = (typeof runners)[number]['language'];

export type RunnerName = UnionToTuple<RunnerLanguage>;

const runnerMap = new Map<string, IRunner<string>>(runners.map((r) => [r.language, r]));

export function getRunner<L extends RunnerLanguage>(language: L): IRunner<L> | undefined {
	return runnerMap.get(language) as IRunner<L> | undefined;
}
