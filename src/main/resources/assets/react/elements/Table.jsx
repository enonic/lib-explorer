export const Table = ({children, headers}) =>
	<table><thead><tr>{headers.map(h => <th>{h}</th>)}</tr></thead><tbody>{children}</tbody></table>;
