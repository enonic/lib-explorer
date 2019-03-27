import classNames from 'classnames';


export const Buttons = ({
	children,
	className,
	icon,
	...rest
}) => <div className={classNames(className, {icon}, 'ui buttons')} {...rest}>{children}</div>;
