import {connect, getIn} from 'formik';


const mySwap = (array, indexA, indexB) => {
	const copy = [...(array || [])];
	const a = copy[indexA];
	copy[indexA] = copy[indexB];
	copy[indexB] = a;
	return copy;
};


export const MoveDownButton = connect(({
	formik: {
		setFieldValue,
		values
	},
	index,
	path,
	swap,
	type,
	currentValue = values && path && getIn(values, path),
	visible = true,
	...rest
}) => {
	if(!visible) { return null; }
	const nextIndex = index + 1;
	return <button type="button" onClick={() => (path && currentValue)
		? setFieldValue(path, mySwap(currentValue, index, nextIndex))
		: swap(index, nextIndex)} {...rest}>↓</button>;
});
