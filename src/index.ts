import * as dotenv from 'dotenv';

dotenv.config();

export type TestFct = () => void;
export const testFct: TestFct = () => {
	console.log('hello world', process.env.TZ);
};

testFct();
