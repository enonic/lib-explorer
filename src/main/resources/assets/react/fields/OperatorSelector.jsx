import {connect, getIn} from 'formik';

import {Radio} from '../elements/Radio';

//import {toStr} from '../utils/toStr';


export const OperatorSelector = connect(({
	formik: {
		setFieldValue,
		values
	},
	defaultValue = 'or',
	parentPath,
	name = parentPath ? `${parentPath}.operator` : 'operator',
	value = values ? getIn(values, name, defaultValue) : defaultValue
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
});
