export const Table = ({children, headers}) =>
	<table><thead><tr>{headers.map((h, i) => <th key={i}>{h}</th>)}</tr></thead><tbody>{children}</tbody></table>;
