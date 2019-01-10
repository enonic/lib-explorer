export const MoveUpButton = ({
	index,
	disabled = index < 1,
	swap,
	type,
	visible = true,
	...rest
}) => {
	if(!visible) { return null; }
	return <button disabled={disabled} onClick={() => swap(index, index-1)} type="button" {...rest}>↑</button>;
};
