
import {getIn} from 'formik';
import {Select} from '../elements/Select';


export const ScrapeQuantifierSelector = ({
	name = 'quantifier',
	parentPath,
	path = parentPath ? `${parentPath}.${name}` : name,
	options = [{
		label: 'Any',
		value: '{0,}'
	}, {
		label: 'Zero or One',
		value: '{0,1}'
	}, {
		label: 'One (or fail)',
		value: '{1}'
	}],
	setFieldValue,
	values,
	value = getIn(values, path) || '{0,}',
	...rest
}) => <Select
	path={path}
	options={options}
	setFieldValue={setFieldValue}
	value={value}
	{...rest}
/>
