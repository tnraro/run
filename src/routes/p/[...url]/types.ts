export interface ITestcase {
	id: string;
	input: string;
	output: string;
  state: number;
	receivedOutput?: string;
	time?: number;
}
