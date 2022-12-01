// import type {QueryDsl} from '/lib/xp/node';
import type {Glue} from '../utils/Glue';


import {
	list,
	//@ts-ignore
} from '/lib/graphql';
import {addMatchAll} from './addMatchAll'


export function addQueryDSL({glue} :{glue :Glue}) {

	const queryDslBooleanClauseInput = glue.addInputType({
		name: 'QueryDSLBooleanClause',
		fields: {
			matchAll: {
				type: addMatchAll({glue})
			},
		}
	});

	return glue.addInputType/*<QueryDsl>*/({
		name: 'QueryDSL',
		fields: {
			boolean: {
				type: glue.addInputType({
					name: 'QueryDSLBoolean',
					fields: {
						must: {
							type: list(queryDslBooleanClauseInput)
						},
						mustNot: {
							type: list(queryDslBooleanClauseInput)
						},
						should: {
							type: list(queryDslBooleanClauseInput)
						},
					}
				})
			},
			matchAll: {
				type: addMatchAll({glue})
			},
		}
	});
}
