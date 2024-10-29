export interface PsProblem {
	url: string;
	title: string;
	content: string;
	testcases: {
		input: string;
		output: string;
	}[];
}

export interface PsAdapter {
  name: string;
	test(url: string): boolean;
	get(url: string): Promise<PsProblem>;
}
