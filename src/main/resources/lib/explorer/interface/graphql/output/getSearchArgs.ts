import { getCommonSearchArgs } from './getCommonSearchArgs';
import type { Glue } from '../utils/Glue';

import {
	GraphQLInt,
	// @ts-ignore No types yet
} from '/lib/graphql';

export function getSearchArgs({ glue }: { glue: Glue; }) {
	return {
		...getCommonSearchArgs({ glue }),
		count: GraphQLInt,
		start: GraphQLInt,
	};
}
