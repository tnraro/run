import html2md from 'html-to-md';

export function md(html: string): string {
	if (html == null) return '';
	return unescapeInLatex(html2md(html));
	function unescapeInLatex(str: string) {
		return str.replaceAll(/(?<=\$[^$]*?)\\(.)(?=[^$]*?\$)/g, '$1');
	}
}
