import type {BasicFilters} from '@enonic/js-utils/src/types/node/query/Filters.d';

export interface QueryFilters {
	boolean?: {
		must?: BasicFilters | Array<BasicFilters>;
		mustNot?: BasicFilters | Array<BasicFilters>;
		should?: BasicFilters | Array<BasicFilters>;
	}
	exists?: {
		field: string;
	}
	notExists?: {
		field: string;
	}
	hasValue?: {
		field: string;
		values: Array<unknown>;
	}
	ids?: {
		values: Array<string>;
	}
}
