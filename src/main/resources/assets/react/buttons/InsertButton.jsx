export const InsertButton = ({index, insert, value}) =>
	<button type="button" onClick={() => insert(index+1, value)}>+</button>;
