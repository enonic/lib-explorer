import classNames from 'classnames';


export const Buttons = ({
	children,
	className,
	icon,
	vertical,
	...rest
}) => <div className={classNames(className, {
	icon,
	vertical
}, 'ui buttons')} {...rest}>{children}</div>;
