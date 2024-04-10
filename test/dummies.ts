// import type {LooseObject} from './types';

// import {
// 	//@ts-ignore
// 	brightRed,
// 	//@ts-ignore
// 	brightYellow,
// 	grey,
// 	white
// } from 'colors/safe';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
// import {stringify} from 'q-i';
// Avoid: could not find declaration file for module
// const {stringify} = require('q-i'); // eslint-disable-line @typescript-eslint/no-var-requires


export const log = { //console.log console.trace
	//@ts-ignore
	debug: (_format: string, ..._s: unknown[]): void => {
		// if (s.length) {
		// 	const colored = s.map(i => stringify(i, { maxItems: Infinity }));
		// 	console.debug(grey(`DEBUG ${format}`), ...colored);
		// } else {
		// 	console.debug(grey(`DEBUG ${format}`));
		// }
	},
	//@ts-ignore
	error: (_format: string, ..._s: unknown[]): void => {
		// if (s.length) {
		// 	const colored = s.map(i => stringify(i, { maxItems: Infinity }));
		// 	console.error(`${brightRed(`ERROR ${format}`)}`, ...colored);
		// } else {
		// 	console.error(brightRed(`ERROR ${format}`));
		// }
	},
	//@ts-ignore
	info: (_format: string, ..._s: unknown[]): void => {
		// if (s.length) {
		// 	const colored = s.map(i => stringify(i, { maxItems: Infinity }));
		// 	console.info(`${white(`INFO  ${format}`)}`, ...colored);
		// } else {
		// 	console.info(white(`INFO  ${format}`));
		// }
	},
	//@ts-ignore
	warning: (_format: string, ..._s: unknown[]): void => {
		// if (s.length) {
		// 	const colored = s.map(i => stringify(i, { maxItems: Infinity }));
		// 	console.warn(`${brightYellow(`WARN  ${format}`)}`, ...colored);
		// } else {
		// 	console.warn(brightYellow(`WARN  ${format}`));
		// }
	}
};
/*log.error('data:%s', {key: 'value'});
log.warning('data:%s', {key: 'value'});
log.info('data:%s', {key: 'value'});
log.debug('data:%s', {key: 'value'});*/
