import type { Glue } from "../../utils/Glue";
import { GQL_ENUM_TYPE } from "../constants";

export function addDslOperatorEnum({ glue }: { glue: Glue; }) {
	return glue.addEnumType({
		name: GQL_ENUM_TYPE.DSL_OPERATOR,
		values: {
			// Yes Enonic documentation uses uppercase:
			// https://developer.enonic.com/docs/code/xp8/storage/querying
			AND: 'AND',
			OR: 'OR',
		}
	});
}
