import classNames from 'classnames';
//import {toStr} from '../utils/toStr';


export const Radio = ({
	className,
	checked,
	children, // So it doesn't end up in ...rest
	label,
	type, // So it doesn't end up in ...rest
	value,
	...rest
}) => {
	//console.debug(toStr({component: 'Radio', className, label, rest}));
	return <div className={classNames(className, 'ui radio checkbox')}>
		<input
			checked={checked}
			name={name}
			type='radio'
			value={value}
			{...rest}
		/>
		<label>{label}</label>
 	</div>;
}
