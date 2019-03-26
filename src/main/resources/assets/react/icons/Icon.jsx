import classNames from 'classnames';
//import {toStr} from '../utils/toStr';


export const Icon = ({
	className, // loading fitted
	disabled,
	children,
	size, // mini tiny small large big huge massive
	...rest
}) => {
	const classStr = classNames(
		'icon',
		`${size}`,
		{
			disabled
		},
		className
	);
	//console.debug(toStr({component: 'Icon', className, size, classStr, rest}));
	return <i
		className={classStr}
		disabled={disabled}
		{...rest}
	>{children}</i>;
}
