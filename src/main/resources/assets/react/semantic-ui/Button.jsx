import classNames from 'classnames';
//import {toStr} from '../utils/toStr';


export const Button = ({
	className,
	children,
	type = 'button', // default is submit
	...rest
}) => {
	//console.debug(toStr({component: 'Button', className, rest}));
	return <button
		className={classNames(className, 'ui', 'button')}
		type={type}
		{...rest}
	>{children}</button>;
}
