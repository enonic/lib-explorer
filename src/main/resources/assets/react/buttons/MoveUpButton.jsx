import {connect, getIn} from 'formik';
import {Button} from './Button';
import {Icon} from '../icons/Icon';


const mySwap = (array, indexA, indexB) => {
	const copy = [...(array || [])];
	const a = copy[indexA];
	copy[indexA] = copy[indexB];
	copy[indexB] = a;
	return copy;
};


export const MoveUpButton = connect(({
	formik: {
		setFieldValue,
		values
	},
	index,
	disabled = index < 1,
	path,
	swap,
	text = '', // ↑
	currentValue = values && path && getIn(values, path),
	visible = true,
	...rest
}) => {
	if(!visible) { return null; }
	const prevIndex = index - 1;
	return <Button
		className={text ? '' : 'icon'}
		disabled={disabled}
		onClick={() => (path && currentValue)
			? setFieldValue(path, mySwap(currentValue, index, prevIndex))
			: swap(index, prevIndex)}
		{...rest}
	><Icon className='blue arrow up'/>{text}</Button>;
});
