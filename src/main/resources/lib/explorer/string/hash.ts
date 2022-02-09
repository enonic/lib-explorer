import {hash as fnv} from '@enonic/fnv-plus';
//import * as fnvPlus from '@enonic/fnv-plus';


export const hash = (string :string, bitlength = 128) :string =>
	fnv(string, bitlength).str();
