import {hash as fnv} from '@enonic/fnv-plus';


export const hash = (string, bitlength = 128) =>
	fnv(string, bitlength).str();
