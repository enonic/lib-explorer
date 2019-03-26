import classNames from 'classnames';
//import {toStr} from '../utils/toStr';


export const Button = ({
	className,
	children,
	type = 'button',
	...rest
}) => {
	//console.debug(toStr({component: 'Button', className, rest}));
	return <button
		className={classNames('ui', 'button', className)}
		type={type}
		{...rest}
	>{children}</button>;
}
