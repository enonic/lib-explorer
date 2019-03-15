export const Table = ({
	children,
	headers = [],
	thStyle,
	...rest
}) => <table {...rest}>
	{headers.length ? <thead>
		<tr>{headers.map((h, i) => <th key={i} style={thStyle}>{h}</th>)}</tr>
	</thead> : null}
	<tbody>{children}</tbody>
</table>;
