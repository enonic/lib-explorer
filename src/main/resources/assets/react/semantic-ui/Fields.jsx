import classNames from 'classnames';


export const Fields = ({
	children,
	className,
	...rest
}) => <div className={classNames('fields', className)} {...rest}>{children}</div>;
