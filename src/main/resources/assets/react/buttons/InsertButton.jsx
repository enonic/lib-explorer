import {getIn} from 'formik';

//import {toStr} from '../utils/toStr';


const myInsert = (array, index, value) => {
	const copy = [...(array || [])];
	copy.splice(index, 0, value);
	return copy;
};


export const InsertButton = ({
	index,
	insert,
	path,
	setFieldValue,
	text = '+',
	value,
	values,
	currentValue = values && path && getIn(values, path)
}) => {
	//const currentValue = (path && values) ? getIn(values, path) : 'path or values not passed in';
	//console.debug(toStr({values, path, currentValue, value}));
	const nextIndex = index+1;

	return <button
		type="button"
		onClick={() => (path && currentValue)
			? setFieldValue(path, myInsert(currentValue, nextIndex, value))
			: insert(nextIndex, value)
		}
	>{text}</button>;
}
