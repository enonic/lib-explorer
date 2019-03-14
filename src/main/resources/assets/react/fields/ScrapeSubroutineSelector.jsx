import {getIn} from 'formik';
import {Select} from '../elements/Select';

//import {toStr} from '../utils/toStr';


export const ScrapeSubroutineSelector = ({
	name = 'subroutine',
	parentPath,
	path = parentPath ? `${parentPath}.${name}` : name,
	options = [{
		label: 'Select using css selector',
		value: 'select'
	}, {
		label: 'Select using xpath selector',
		value: 'x'
	}, {
		label: 'Remove',
		value: 'remove'
	}, {
		label: 'Read text content',
		value: 'read property textContent'
	}, {
		label: 'Read attribute',
		value: 'read attribute'
	}, {
		label: 'Read property',
		value: 'read property'
	}, {
		label: 'Replace double whitespace with single space',
		value: 'wc'
	}, {
		label: 'Trim',
		value: 'trim'
	}, {
		label: 'Lowercase',
		value: 'lc'
	}, {
		label: 'Uppercase first character',
		value: 'ucFirst'
	}],
	setFieldValue,
	values,
	value = getIn(values, path) || undefined,
	...rest
}) => {
	//console.debug(toStr({path, value}));
	return <Select
		path={path}
		options={options}
		setFieldValue={setFieldValue}
		value={value}
		{...rest}
	/>;
} // ScrapeSubroutineSelector
