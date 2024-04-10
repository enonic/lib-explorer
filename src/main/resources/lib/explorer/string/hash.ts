//import {hash as fnv} from '@enonic/fnv-plus'; // [!] Error: 'hash' is not exported by node_modules/@enonic/fnv-plus/index.js
//import * as fnvPlus from '@enonic/fnv-plus';

// @ts-ignore Import assignment cannot be used when targeting ECMAScript modules.
import fnvPlus = require('@enonic/fnv-plus');

const {hash: fnv} = fnvPlus;

export const hash = (string :string, bitlength = 128) :string =>
	fnv(string, bitlength).str();
