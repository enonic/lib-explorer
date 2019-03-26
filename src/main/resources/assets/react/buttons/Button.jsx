import classNames from 'classnames';
//import {toStr} from '../utils/toStr';


export const Button = ({
	className,
	children,
	type, // So it doesn't end up in rest
	...rest
}) => {
	//console.debug(toStr({component: 'Button', className, rest}));
	return <button
		className={classNames('ui', 'button', className)}
		type='button'
		{...rest}
	>{children}</button>;
}
