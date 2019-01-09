export const MoveDownButton = ({index, swap}) =>
	<button type="button" onClick={() => swap(index, index+1)}>↓</button>;
