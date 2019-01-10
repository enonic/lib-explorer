export const MoveDownButton = ({
	index,
	swap,
	type,
	visible = true,
	...rest
}) => {
	if(!visible) { return null; }
	return <button type="button" onClick={() => swap(index, index+1)} {...rest}>↓</button>;
};
