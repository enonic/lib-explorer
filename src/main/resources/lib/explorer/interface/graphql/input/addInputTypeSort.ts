import type {Glue} from '../utils/Glue';


import {
	GraphQLFloat,
	GraphQLString,
	nonNull
	// @ts-ignore
} from '/lib/graphql';
import {
	GQL_INPUT_TYPE_SORT,
	GQL_INPUT_TYPE_SORT_LOCATION
} from './constants';


export function addInputTypeSort({
	glue
}: {
	glue: Glue
}) {
	const sortDirectionEnumType = glue.addEnumType({
		name: 'SortDirection',
		description: 'Sort direction',
		values: {
			asc: 'ASC',
			desc: 'DESC'
		}
	});

	const sortLocationInputType = glue.addInputType({
		name: GQL_INPUT_TYPE_SORT_LOCATION,
		description: 'Sort by distance to a geoPoint',
		fields: {
			lat: {
				type: nonNull(GraphQLFloat)
			},
			lon: {
				type: nonNull(GraphQLFloat)
			}
		}

	});

	// TODO Use addEnumTypeGeoDistanceUnit instead, but it's a breaking change...
	const sortUnitEnumType = glue.addEnumType({
		name: 'SortUnit',
		description: 'Sort unit',
		values: {
			m: 'm',
			meters:'meters',
			in: 'in',
			inch: 'inch',
			yd: 'yd',
			yards: 'yards',
			ft: 'ft',
			feet: 'feet',
			km: 'km',
			kilometers: 'kilometers',
			NM: 'NM',
			nmi: 'nmi',
			nauticalmiles: 'nauticalmiles',
			mm: 'mm',
			millimeters: 'millimeters',
			cm: 'cm',
			centimeters: 'centimeters',
			mi: 'mi',
			miles: 'miles'
		}
	});

	return glue.addInputType({
		name: GQL_INPUT_TYPE_SORT,
		description: 'Sort by field in direction',
		fields: {
			field: {
				type: nonNull(GraphQLString)
			},
			direction: {
				type: sortDirectionEnumType
			},
			location: {
				type: sortLocationInputType
			},
			unit: {
				type: sortUnitEnumType
			}
		}
	});
}
