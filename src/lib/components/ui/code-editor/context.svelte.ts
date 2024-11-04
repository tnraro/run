import type { RunnerLanguage } from '$lib/server/run';
import { onMount, tick } from 'svelte';
import templateCpp from './template.cpp?raw';
import templateJs from './template.js?raw';

export class Code {
	static #templates: Record<RunnerLanguage, string> = {
		cpp: templateCpp,
		js: templateJs
	};
	static readonly Languages = [...Object.keys(Code.#templates)];
	static readonly DefaultLanguage = 'cpp';
	#lang = $state<RunnerLanguage>(Code.DefaultLanguage);
	#id;
	constructor(id: string) {
		this.#id = id;

		onMount(() => {
			this.#lang = this.#getItem(this.#langKey(), () => Code.DefaultLanguage);
			tick().then(() => {
				this.#code = this.#getItem(this.#codeKey(), () => Code.#templates[this.#lang]);
			});
		});
	}
	get lang() {
		return this.#lang;
	}
	set lang(value: RunnerLanguage) {
		this.#code = this.#getItem(this.#codeKey(value), () => Code.#templates[this.#lang]);
		this.#setItem(this.#langKey(), value);
		this.#lang = value;
	}

	#code = $state<string>();
	get code() {
		return this.#code ?? '';
	}
	set code(value: string) {
		this.#setItem(this.#codeKey(), value);
		this.#code = value;
	}
	#codeKey(lang?: RunnerLanguage) {
		if ((lang ?? this.#lang) === Code.DefaultLanguage) {
			return `${this.#id}:code`;
		}
		return `${this.#id}:code:${lang ?? this.#lang}`;
	}
	#langKey() {
		return `${this.#id}:lang`;
	}
	#getItem<T extends string>(key: string, defaultFn: () => T): T {
		if (typeof window === 'undefined') return defaultFn();
		const x = localStorage.getItem(key) as T;
		return x != null ? x : defaultFn();
	}
	#setItem(key: string, value: string) {
		if (typeof window === 'undefined') return;
		localStorage.setItem(key, value);
	}
	async copy() {
		if (this.#code == null) throw new Error('The code is null');
		await navigator.clipboard?.writeText(this.#code);
	}
}
