import {toStr} from '/lib/enonic/util';

// Inlined so ava tests can run without Enonic XP:
const forceArray = data => Array.isArray(data) ? data : [data];


// Due to asciifolding, unicode wordboundaries, etc it's hard to compare with
// the searchString, so lets skip that for now.

export function mapSynonyms({
	expand = false,
	from = [],
	searchString = '',
	to = []
}) {
	//if (!searchString) { return null; }
	//const lcSearchString = searchString.toLowerCase();
	const incomingFrom = forceArray(from);
	const incomingTo = forceArray(to);
	log.info(toStr({
		//searchString,
		//lcSearchString,
		expand,
		from,
		incomingFrom,
		to,
		incomingTo
	}));
	const outgoingFrom = [];
	const outgoingTo = [];

	// First find if there are any matches in the searchString
	incomingFrom.forEach(f => {
		if (
			!outgoingFrom.includes(f) // Not when it's already there
			//&&
			//lcSearchString.includes(f.toLowerCase()) // Only put stuff that are in searchString in outgoingFrom
		) {
			outgoingFrom.push(f);
		}
	});
	if (expand) { // Only put stuff in outgoingFrom from incomingTo when expand is true
		incomingTo.forEach(t => {
			if (
				!outgoingFrom.includes(t) // Not when it's already there
				//&&
				//lcSearchString.includes(t.toLowerCase()) // Only put stuff that are in searchString in outgoingFrom
			) {
				outgoingFrom.push(t);
			}
		});
	}
	log.info(toStr({
		outgoingFrom
	}));
	//if (!outgoingFrom.length) { return null; }

	// Then build synonyms
	if (expand) { // Only put stuff in outgoingTo from incomingFrom when expand is true
		incomingFrom.forEach(f => {
			if (
				!outgoingTo.includes(f) // Not when it's already there
				//&&
				//!lcSearchString.includes(f.toLowerCase()) // Never put stuff that are in searchString in outgoingTo
			) {
				outgoingTo.push(f);
			}
		});
	}

	incomingTo.forEach(t => {
		if (
			!outgoingTo.includes(t) // Not when it's already there
			//&&
			//!lcSearchString.includes(t.toLowerCase()) // Never put stuff that are in searchString in outgoingTo
		) {
			outgoingTo.push(t);
		}
	});

	log.info(toStr({
		outgoingTo
	}));
	//if (!outgoingTo.length) { return null; }

	return {
		from: outgoingFrom,
		to: outgoingTo
	}
} // mapSynonyms
