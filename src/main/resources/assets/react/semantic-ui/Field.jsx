import classNames from 'classnames';


export const Field = ({
	children,
	className,
	...rest
}) => <div className={classNames('field', className)} {...rest}>{children}</div>;
