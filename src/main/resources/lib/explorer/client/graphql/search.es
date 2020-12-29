//import {wash} from '/lib/explorer/query/wash';
import {search} from '/lib/explorer/client';
import {
	createInputObjectType,
	createObjectType,
	createSchema,
	//createUnionType,
	//execute,
	//GraphQLBoolean,
	//GraphQLFloat,
	GraphQLInt,
	GraphQLString,
	list,
	nonNull
} from '/lib/graphql';
import {toStr} from '/lib/util';


const COUNT_DEFAULT = 10;

const HIT_FIELDS_DEFAULT = {
	text: { type: nonNull(GraphQLString) },
	title: { type: nonNull(GraphQLString) },
	url: { type: nonNull(GraphQLString) } // If the protocol (https, ftp, etc.) is either present or implied for a domain, you should call it a URL—even though it’s also a URI.
};


const generateResolver = ({
	count = COUNT_DEFAULT,
	filterFields = {},
	hitFields = HIT_FIELDS_DEFAULT,
	interfaceName
} = {}) => {
	//log.info(`filterFields:${toStr(filterFields)}`);
	if (!interfaceName) {
		throw new Error('Required parameter interfaceName missing!');
	}
	return (env) => {
		//log.info(`env:${toStr(env)}`);
		const {
			f = {},
			q = '',
			p = 1
		} = env.args;
		//log.info(`f:${toStr(f)}`);

		//const washedSearchString = wash({string: q});
		//log.debug(`washedSearchString:${toStr(washedSearchString)}`);

		const res = search({
			count,
			facets: f,
			interface: interfaceName,
			q,
			page: p
		});
		res.params = {
			//f,
			q,
			p
		};

		//log.info(`facetCategoriesArray:${toStr(res.facetCategories)}`);
		const facetCategoriesObj = {};
		res.facetCategories.forEach(({field, ...rest}) => {
			facetCategoriesObj[field] = rest;
		});
		//log.info(`facetCategoriesObj:${toStr(facetCategoriesObj)}`);

		res.filters = {};
		Object.keys(filterFields).forEach((field) => {
			res.filters[field] = facetCategoriesObj[field];
		});
		//log.info(`filters:${toStr(res.filters)}`);

		res.hits = res.hits.map((hit) => { // TODO This doesn't handle resolvers...
			const rv = {};
			Object.keys(hitFields).forEach((field) => {
				rv[field] = hit[field];
			});
			return rv;
		});
		return res;
	};
}; // generateResolver

// facets
// filterFields
// activeFilters (affects which hits)
// sort relevance field

export const generateSchema = ({
	count = COUNT_DEFAULT,
	filterFields = {},
	hitFields = HIT_FIELDS_DEFAULT,
	interfaceName
}) => (() => {
	//log.info(`filterFields:${toStr(filterFields)}`);
	//log.info(`hitFields:${toStr(hitFields)}`);
	const args = {
		q: GraphQLString,
		p: GraphQLInt
	};
	const argsFiltersFields = {};
	Object.keys(filterFields).forEach((field) => {
		//log.info(`field:${toStr(field)}`);
		if (hitFields[field]) {
			throw Error(`filterField:${field} conflicts with hitField!`);
		}
		hitFields[field] = { type: list(createObjectType({
			name: `Tag${field}`,
			fields: {
				displayName: { type: nonNull(GraphQLString) },
				href: { type: nonNull(GraphQLString) },
				name: { type: nonNull(GraphQLString) },
				path: { type: nonNull(GraphQLString) }//,
				//field: { type: nonNull(GraphQLString) },
			}
		}))};
		argsFiltersFields[field] = { type: list(GraphQLString)};
	});
	if (Object.keys(argsFiltersFields).length) {
		args.f = createInputObjectType({
			name: 'ArgsFilters',
			fields: argsFiltersFields
		});
	}
	//log.info(`hitFields:${toStr(hitFields)}`);
	return createSchema({
		query: createObjectType({
			name: 'Query',
			fields: {
				search: {
					args,
					resolve: generateResolver({
						count,
						filterFields,
						hitFields,
						interfaceName
					}),
					type: createObjectType({ // Output
						name: 'SearchResult',
						fields: {
							count: { type: nonNull(GraphQLInt) },
							filters: { type: createObjectType({
								name: 'SearchResultFilters',
								fields: filterFields
							})},
							hits: { type: list(createObjectType({
								name: 'SearchResultHit',
								fields: hitFields
							}))}, // SearchResult.fields.hits
							params: {
								type: nonNull(createObjectType({
									name: 'SearchResultParams',
									fields: { // NOTE: Same as search args
										/*f: { type: createObjectType({
											name: '',
											fields: {
												// TODO
											}
										})}*/
										q: { type: GraphQLString },
										p: { type: GraphQLInt }
									}
								})) // SearchResultParams
							}, // SearchResult.fields.params
							total: { type: nonNull(GraphQLInt) }
						} // SearchResult.fields
					}) // SearchResult
				} // search
			} // fields
		}) // query
	}); // createSchema
})(); // generateSchema


/* GQL example
{
	search {
		hits {
			url
		}
	}

	search(
		q: ''
	) {
		hits {
			url
		}
	}

}*/
