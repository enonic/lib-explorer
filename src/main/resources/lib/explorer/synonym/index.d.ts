import type { HighlightResult } from '@enonic/js-utils/types/node/index.d';


export type SynonymsArrayItem = {
	_highlight: HighlightResult;
	_score: number;
	// from: string[];
	synonyms: {
		locale: string;
		synonym: string;
	}[];
	thesaurusName: string;
	// to: string[];
}

export type SynonymsArray = SynonymsArrayItem[];
