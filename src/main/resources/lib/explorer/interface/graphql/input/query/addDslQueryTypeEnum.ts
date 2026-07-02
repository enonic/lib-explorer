import type { Glue } from "../../utils/Glue";
import { GQL_ENUM_TYPE } from "../constants";

export function addDslQueryTypeEnum({ glue }: { glue: Glue; }) {
	return glue.addEnumType({
		name: GQL_ENUM_TYPE.DSL_QUERY_TYPE,
		values: {
			dateTime: 'dateTime',
			time: 'time',
		}
	});
}
