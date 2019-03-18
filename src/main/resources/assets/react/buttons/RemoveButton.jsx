import {connect, getIn} from 'formik';


const isFunction = (obj) => typeof obj === 'function';


const myRemove = (array, index) => {
	const copy = array ? [...array] : [];
	if (isFunction(copy.splice)) {
    	copy.splice(index, 1);
	}
	return copy;
}


export const RemoveButton = connect(({
	formik: {
		setFieldValue,
		values
	},
	index,
	path,
	remove,
	text = '-',
	type,
	currentValue = values && path && getIn(values, path),
	visible = true,
	...rest}) => {
	if(!visible) { return null; }
	//console.log(JSON.stringify({index, rest}, null, 4));
	return <button onClick={() => (path && currentValue)
		? setFieldValue(path, myRemove(currentValue, index))
		: remove(index)
	} type="button" {...rest}>{text}</button>
});
