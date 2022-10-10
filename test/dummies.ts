import type {LooseObject} from './types';

import {
	//@ts-ignore
	brightRed,
	//@ts-ignore
	brightYellow,
	grey,
	white
} from 'colors/safe';
import {stringify} from 'q-i';


export const log = { //console.log console.trace
	//@ts-ignore
	debug: (format :string, ...s :unknown[]) :void => {
		/*if (s.length) {
			const colored = s.map(i => stringify(i, { maxItems: Infinity }));
			console.debug(grey(`DEBUG ${format}`), ...colored);
		} else {
			console.debug(grey(`DEBUG ${format}`));
		}*/
	},
	//@ts-ignore
	error: (format :string, ...s :unknown[]) :void => {
		/*if (s.length) {
			const colored = s.map(i => stringify(i, { maxItems: Infinity }));
			console.error(`${brightRed(`ERROR ${format}`)}`, ...colored);
		} else {
			console.error(brightRed(`ERROR ${format}`));
		}*/
	},
	//@ts-ignore
	info: (format :string, ...s :unknown[]) :void => {
		// if (s.length) {
		// 	const colored = s.map(i => stringify(i, { maxItems: Infinity }));
		// 	console.info(`${white(`INFO  ${format}`)}`, ...colored);
		// } else {
		// 	console.info(white(`INFO  ${format}`));
		// }
	},
	//@ts-ignore
	warning: (format :string, ...s :unknown[]) :void => {
		/*if (s.length) {
			const colored = s.map(i => stringify(i, { maxItems: Infinity }));
			console.warn(`${brightYellow(`WARN  ${format}`)}`, ...colored);
		} else {
			console.warn(brightYellow(`WARN  ${format}`));
		}*/
	}
};
/*log.error('data:%s', {key: 'value'});
log.warning('data:%s', {key: 'value'});
log.info('data:%s', {key: 'value'});
log.debug('data:%s', {key: 'value'});*/
