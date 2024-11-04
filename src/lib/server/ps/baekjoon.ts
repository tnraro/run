import { load } from 'cheerio';
import type { PsAdapter } from './ps-adapter';
import { mdSetup } from './utils';

const md = mdSetup({
	tagListener(tag, props) {
		if (tag === 'img') {
			if (!/^(?:https?:)?\/\//.test(props.attrs.src)) {
				props.attrs.src = `https://www.acmicpc.net${props.attrs.src}`;
			}
		}
		return props;
	}
});

export const baekjoonAdapter: PsAdapter = {
	name: 'baekjoon',
	test(url) {
		return url.startsWith('https://www.acmicpc.net/problem/');
	},
	async get(url) {
		const res = await fetch(url, {
			headers: {
				'User-Agent':
					'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36'
			}
		});
		const html = await res.text();
		const $ = load(html);
		const title = $('#problem_title').text();
		const content = `## 문제
${md($('#problem_description').html()!)}

## 입력
${md($('#problem_input').html()!)}

## 출력
${md($('#problem_output').html()!)}`;
		const inputs = $('.sampledata[id^=sample-input-]')
			.toArray()
			.map((e) => $(e).text().trim());
		const outputs = $('.sampledata[id^=sample-output-]')
			.toArray()
			.map((e) => $(e).text().trim());
		return {
			url: url,
			title,
			content,
			testcases: inputs.map((input, i) => ({
				input,
				output: outputs[i]
			}))
		};
	}
};
