
import lexer from '/lib/explorer/client/graphql/lexer';
import parser from '/lib/explorer/client/graphql/parser';

export function gqlToObj(gql) {
	const tokens = lexer(gql);
	return parser(tokens);
}
