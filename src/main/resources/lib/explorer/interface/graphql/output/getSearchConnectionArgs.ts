import { getCommonSearchArgs } from './getCommonSearchArgs';
import type { Glue } from '../utils/Glue';

import {
	GraphQLInt,
	GraphQLString,
	// @ts-ignore No types yet
} from '/lib/graphql';

export function getSearchConnectionArgs({ glue }: { glue: Glue; }) {
	return {
		...getCommonSearchArgs({ glue }),
		after: GraphQLString,
		first: GraphQLInt,
	};
}
