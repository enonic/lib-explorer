// Ported from lib-guillotine /lib/guillotine/util/factory
import type {Filter} from '/lib/xp/node';
import type {AnyObject} from '@enonic-types/lib-explorer';


interface HasValueFilterInput extends AnyObject {
	field: string
	stringValues?: string[]
	intValues?: number[]
	floatValues?: number[]
	booleanValues?: boolean[]
}

interface BooleanFilterInput {
	must?: AnyObject[]
	mustNot?: AnyObject[]
	should?: AnyObject[]
}


export function createFilters(inputFilters?: AnyObject[]): Filter[] {
    return inputFilters && inputFilters.length > 0 ? inputFilters.map(inputFilter => {
        const filter: AnyObject = {};

        Object.keys(inputFilter).forEach(filterName => {
            if (filterName === 'hasValue') {
                filter.hasValue = processHasValueFilter(inputFilter.hasValue as HasValueFilterInput);
            } else if (filterName === 'boolean') {
                filter.boolean = processBooleanFilter(inputFilter.boolean as BooleanFilterInput);
            } else {
                filter[filterName] = inputFilter[filterName];
            }
        });

        return filter as unknown as Filter;
    }) : [];
}

function processHasValueFilter(hasValueFilter: HasValueFilterInput) {
    if (Object.prototype.hasOwnProperty.call(hasValueFilter, 'field') && Object.keys(hasValueFilter).length > 2) {
        throw 'HasValueFilter must have only one type of values from ("stringValues, intValues, floatValues and booleanValues")';
    }

    const filter: AnyObject = {
        field: hasValueFilter['field']
    };

    (['stringValues', 'intValues', 'floatValues', 'booleanValues'] as const).some(fieldName => {
        if (Object.prototype.hasOwnProperty.call(hasValueFilter, fieldName)) {
            filter['values'] = hasValueFilter[fieldName];
            return true;
        }
        return false;
    });

    return filter;
}

function processBooleanFilter(booleanFilterInput: BooleanFilterInput) {
    const booleanFilter: AnyObject = {};

    if (Object.prototype.hasOwnProperty.call(booleanFilterInput, 'must')) {
        booleanFilter.must = createFilters(booleanFilterInput.must);
    }
    if (Object.prototype.hasOwnProperty.call(booleanFilterInput, 'mustNot')) {
        booleanFilter.mustNot = createFilters(booleanFilterInput.mustNot);
    }
    if (Object.prototype.hasOwnProperty.call(booleanFilterInput, 'should')) {
        booleanFilter.should = createFilters(booleanFilterInput.should);
    }

    return booleanFilter;
}
