export const Table = ({children, headers = [], ...rest}) => <table {...rest}>
	{headers.length ? <thead>
		<tr>{headers.map((h, i) => <th key={i}>{h}</th>)}</tr>
	</thead> : null}
	<tbody>{children}</tbody>
</table>;
