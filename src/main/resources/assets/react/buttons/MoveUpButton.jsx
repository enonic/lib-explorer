import {getIn} from 'formik';


const mySwap = (array, indexA, indexB) => {
	const copy = [...(array || [])];
	const a = copy[indexA];
	copy[indexA] = copy[indexB];
	copy[indexB] = a;
	return copy;
};


export const MoveUpButton = ({
	index,
	disabled = index < 1,
	path,
	setFieldValue,
	swap,
	type,
	values,
	currentValue = values && path && getIn(values, path),
	visible = true,
	...rest
}) => {
	if(!visible) { return null; }
	const prevIndex = index - 1;
	return <button disabled={disabled} onClick={() => (path && currentValue)
		? setFieldValue(path, mySwap(currentValue, index, prevIndex))
		: swap(index, prevIndex)} type="button" {...rest}
	>↑</button>;
};
