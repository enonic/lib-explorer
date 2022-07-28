//import {toStr} from '@enonic/js-utils/dist/cjs/value/toStr';
import {deepStrictEqual} from 'assert';
import {
	languagesObjectToArray
} from '../../../../src/main/resources/lib/explorer/synonym/languagesObjectToArray';


const A_COMMENT = 'a_comment';
const AN_INTERFACE = 'an_interface';
const EN = 'en';
const NO = 'no';
const SYNONYM = 'A01AA02';
const ZXX = 'zxx';


describe('synonym', () => {
	describe('languagesObjectToArray()', () => {
		it('handles when languagesObject is undefined', () => {
			deepStrictEqual(
				[],
				languagesObjectToArray({
					languagesObject: undefined
				})
			);
		}); // it

		it('handles when values are missing or singular', () => {
			deepStrictEqual(
				[{
					both: [], // from undefined
					comment: '', // from undefined
					disabledInInterfaces: [], // from undefined
					enabled: true, // from undefined
					from: [{ // from singular
						comment: A_COMMENT,
						disabledInInterfaces: [AN_INTERFACE], // from singular
						enabled: false,
						synonym: SYNONYM
					}],
					locale: ZXX,
					to: [] // from empty array
				}],
				languagesObjectToArray({
					languagesObject: {
						[ZXX]: {
							//comment: 'a_comment', // undefined
							//enabled: false, // undefined
							//disabledInInterfaces: 'an_interface',// undefined
							//both: [], // undefined
							from: { // singular
								comment: A_COMMENT,
								enabled: false,
								disabledInInterfaces: AN_INTERFACE, // singular
								synonym: SYNONYM
							},
							to: [] // empty array
						}
					}
				})
			);
		}); // it

		it('handles when values are multiple', () => {
			const disabledInInterfaces = [
				AN_INTERFACE,
				'another_interface'
			];
			const arrayOfLanguageSynonymObjects = [{
				comment: A_COMMENT,
				disabledInInterfaces,
				enabled: false,
				synonym: SYNONYM
			}];
			const a_language = {
				comment: A_COMMENT,
				enabled: false,
				disabledInInterfaces,
				both: arrayOfLanguageSynonymObjects,
				from: arrayOfLanguageSynonymObjects,
				to: arrayOfLanguageSynonymObjects
			};
			deepStrictEqual(
				[{
					both: arrayOfLanguageSynonymObjects,
					comment: A_COMMENT,
					disabledInInterfaces,
					enabled: false,
					from: arrayOfLanguageSynonymObjects,
					locale: EN,
					to: arrayOfLanguageSynonymObjects
				},{
					both: arrayOfLanguageSynonymObjects,
					comment: A_COMMENT,
					disabledInInterfaces,
					enabled: false,
					from: arrayOfLanguageSynonymObjects,
					locale: NO,
					to: arrayOfLanguageSynonymObjects
				},{
					both: arrayOfLanguageSynonymObjects,
					comment: A_COMMENT,
					disabledInInterfaces,
					enabled: false,
					from: arrayOfLanguageSynonymObjects,
					locale: ZXX,
					to: arrayOfLanguageSynonymObjects
				}],
				languagesObjectToArray({
					languagesObject: {
						[ZXX]: a_language,
						[NO]: a_language,
						[EN]: a_language
					}
				})
			);
		}); // it
	}); // describe languagesObjectToArray
}); // describe synonym
