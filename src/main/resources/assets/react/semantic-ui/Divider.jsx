import classNames from 'classnames';


export const Divider = ({
	className,
	children,

	hidden,

	...rest
}) => {
	return <div
		className={classNames(
			className,
			{hidden},
			'ui divider'
		)}
		{...rest}
	>{children}</div>;
}
