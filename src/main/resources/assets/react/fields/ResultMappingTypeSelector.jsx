import {getIn} from 'formik';
import {Select} from '../elements/Select';


export const ResultMappingTypeSelector = ({
	name = 'type',
	parentPath,
	path = parentPath ? `${parentPath}.${name}` : name,
	setFieldValue,
	values,
	value = values && getIn(values, path) || 'string',
	...rest
}) => <Select
	path={path}
	options={[{
		label: 'String',
		value: 'string'
	}, {
		label: 'Tag(s)',
		value: 'tags'
	}]}
	setFieldValue={setFieldValue}
	value={value}
	{...rest}
/> // ResultMappingTypeSelector
