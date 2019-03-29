import {Field} from 'formik';
import classNames from 'classnames';
//import {toStr} from '../utils/toStr';


export const Checkbox = ({
	className,
	checked,
	children, // So it doesn't end up in ...rest
	label,
	name,
	type, // So it doesn't end up in ...rest
	...rest
}) => {
	//console.debug(toStr({component: 'Checkbox', className, label, rest}));
	return <div className={classNames(className, 'ui checkbox')}>
		<Field
			checked={checked}
			name={name}
			type='checkbox'
			{...rest}
		/>
		<label>{label}</label>
 	</div>;
}
