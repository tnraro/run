import html2md from 'html-to-md';
import type { Html2MdOptions } from 'html-to-md/dist/type';

export const mdSetup =
	(options?: Html2MdOptions) =>
	(html: string): string => {
		if (html == null) return '';
		return unescapeInLatex(html2md(html, options));
		function unescapeInLatex(str: string) {
			return str.replaceAll(/(?<=\$[^$]*?)\\(.)(?=[^$]*?\$)/g, '$1');
		}
	};
