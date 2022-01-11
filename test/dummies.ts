import type {LooseObject} from './types';

import {
	brightRed,
	brightYellow,
	//grey,
	white
} from 'colors/safe';
import {stringify} from 'q-i';

import {NODES} from './testData';


export const log = { //console.log console.trace
	debug: () => {},
	/*debug: (format :string, ...s :unknown[]) => {
		if (s.length) {
			const colored = s.map(i => stringify(i, { maxItems: Infinity }));
			console.debug(grey(`DEBUG ${format}`), ...colored);
		} else {
			console.debug(grey(`DEBUG ${format}`));
		}
	},*/
	error: (format :string, ...s :unknown[]) => {
		if (s.length) {
			const colored = s.map(i => stringify(i, { maxItems: Infinity }));
			console.error(`${brightRed(`ERROR ${format}`)}`, ...colored);
		} else {
			console.error(brightRed(`ERROR ${format}`));
		}
	},
	info: (format :string, ...s :unknown[]) => {
		if (s.length) {
			const colored = s.map(i => stringify(i, { maxItems: Infinity }));
			console.info(`${white(`INFO  ${format}`)}`, ...colored);
		} else {
			console.info(white(`INFO  ${format}`));
		}
	},
	warning: (format :string, ...s :unknown[]) => {
		if (s.length) {
			const colored = s.map(i => stringify(i, { maxItems: Infinity }));
			console.warn(`${brightYellow(`WARN  ${format}`)}`, ...colored);
		} else {
			console.warn(brightYellow(`WARN  ${format}`));
		}
	}
};
/*log.error('data:%s', {key: 'value'});
log.warning('data:%s', {key: 'value'});
log.info('data:%s', {key: 'value'});
log.debug('data:%s', {key: 'value'});*/

export const CONNECT_DUMMY = (/*source*/) => ({
	create: (data :LooseObject) => data,
	get: (id :string) => {
		return NODES[id];
	}
});
