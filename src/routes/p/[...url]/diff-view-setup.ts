import type { Extension } from '@codemirror/state';
import { keymap } from '@codemirror/view';
import { defaultKeymap, historyKeymap } from '@codemirror/commands';

export const diffViewSetup = () => {
	const extensions: Extension[] = [];
	extensions.push(keymap.of([...defaultKeymap, ...historyKeymap]));
	return extensions;
};
