import type { Glue } from '../utils/Glue';

import {
    GraphQLBoolean,
    GraphQLString,
    list,
    // @ts-ignore No types yet
} from '/lib/graphql';

import { addAggregationInput } from '/lib/explorer/interface/graphql/aggregations/guillotine/input/addAggregationInput';
import { addFilterInput } from '/lib/explorer/interface/graphql/filters/guillotine/input/addFilterInput';
import { addInputTypeHighlight } from '/lib/explorer/interface/graphql/highlight/input/addInputTypeHighlight';
import { addInputTypeSort } from '/lib/explorer/interface/graphql/input/addInputTypeSort';
import { addQueryDslInput } from '/lib/explorer/interface/graphql/input/query/addQueryDslInput';

export function getCommonSearchArgs({ glue }: { glue: Glue; }) {
    const aggregationsArg = list(addAggregationInput({ glue }));
    const filtersArg = list(addFilterInput({ glue }));
    const highlightArg = addInputTypeHighlight({ glue });
    const languagesArg = list(GraphQLString);
    const sortArg = list(addInputTypeSort({ glue }));

    return {
        aggregations: aggregationsArg,
        explain: GraphQLBoolean,
        filters: filtersArg,
        highlight: highlightArg,
        languages: languagesArg,
        profiling: GraphQLBoolean,
        query: addQueryDslInput({ glue }),
        searchString: GraphQLString, // Can't be nonNull when used as subQuery
        sort: sortArg
    };
}
