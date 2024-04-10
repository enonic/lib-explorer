import {isSet} from '@enonic/js-utils';

// WARN: Not certain that Nashorn supports "Unicode" RegExp!
//
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/unicode
// u	"Unicode"; treat a pattern as a sequence of Unicode code points.
//
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/unicodeSets
// v	An upgrade to the u mode with more Unicode features.
const WHITELIST_PATTERN = `[^-a-zA-Z_ '''"ÆÐƎƏƐƔĲŊŒẞÞǷȜæðǝəɛɣĳŋœĸſßþƿȝĄƁÇĐƊĘĦĮƘŁØƠŞȘŢȚŦŲƯY̨Ƴąɓçđɗęħįƙłøơşșţțŧųưy̨ƴÁÀÂÄǍĂĀÃÅǺĄÆǼǢƁĆĊĈČÇĎḌĐƊÐÉÈĖÊËĚĔĒĘẸƎƏƐĠĜǦĞĢƔáàâäǎăāãåǻąæǽǣɓćċĉčçďḍđɗðéèėêëěĕēęẹǝəɛġĝǧğģɣĤḤĦIÍÌİÎÏǏĬĪĨĮỊĲĴĶƘĹĻŁĽĿʼNŃN̈ŇÑŅŊÓÒÔÖǑŎŌÕŐỌØǾƠŒĥḥħıíìiîïǐĭīĩįịĳĵķƙĸĺļłľŀŉńn̈ňñņŋóòôöǒŏōõőọøǿơœŔŘŖŚŜŠŞȘṢẞŤŢṬŦÞÚÙÛÜǓŬŪŨŰŮŲỤƯẂẀŴẄǷÝỲŶŸȲỸƳŹŻŽẒŕřŗſśŝšşșṣßťţṭŧþúùûüǔŭūũűůųụưẃẁŵẅƿýỳŷÿȳỹƴźżžẓ]+`;

// https://eslint.org/docs/latest/rules/no-misleading-character-class
/* eslint-disable-next-line no-misleading-character-class */
const WHITELIST_REGEXP = new RegExp(WHITELIST_PATTERN, 'gi');


export function replaceNonLetters({
	string,
	replacement = '',
	whitelistRegEx = WHITELIST_REGEXP
}) {
	if(isSet(string)) {
		return string.replace(whitelistRegEx, replacement).replace(/\s\s+/g, ' ').trim();
	}
	return string;
}
