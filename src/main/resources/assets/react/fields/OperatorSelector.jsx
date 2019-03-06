import {get} from 'lodash';

import {Radio} from '../elements/Radio';

//import {toStr} from '../utils/toStr';


export const OperatorSelector = ({
	defaultValue = 'or',
	parentPath,
	name = parentPath ? `${parentPath}.operator` : 'operator',
	setFieldValue,
	values,
	value = values ? get(values, name, defaultValue) : defaultValue
}) => {
	/*console.debug(toStr({
		defaultValue, legend, parentPath, name, values, value
	}));*/
	return <React.Fragment>
		<Radio
			checked={value !== 'and'}
			label="OR"
			name={name}
			onChange={() => {
				//console.debug(toStr({name, or: 'or'}));
				setFieldValue(name, 'or')
			}}
			value={value}
		/>
		<Radio
			checked={value === 'and'}
			label="AND"
			name={name}
			onChange={() => {
				//console.debug(toStr({name, and: 'and'}));
				setFieldValue(name, 'and')
			}}
			value={value}
		/>
	</React.Fragment>;
}