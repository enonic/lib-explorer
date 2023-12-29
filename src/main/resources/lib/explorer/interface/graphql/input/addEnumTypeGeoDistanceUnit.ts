import type {Glue} from '../utils/Glue';
import { GQL_ENUM_TYPE_NAME_GEO_DISTANCE_UNIT } from './constants';

export function addEnumTypeGeoDistanceUnit({
	glue
}: {
	glue: Glue
}) {
	return glue.addEnumType({
		name: GQL_ENUM_TYPE_NAME_GEO_DISTANCE_UNIT,
		description: 'The meassurement unit to use for the ranges. Legal values are either the full name or the abbreviation of the following: km (kilometers), m (meters), cm (centimeters), mm (millimeters), mi (miles), yd (yards), ft (feet), in (inch) or nmi (nauticalmiles or NM).',
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
}
