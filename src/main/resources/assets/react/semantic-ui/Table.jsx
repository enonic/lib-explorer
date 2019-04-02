import classNames from 'classnames';


export const Table = ({
	children,
	className,
	celled = true,
	collapsing,
	compact = true,
	selectable = true,
	sortable,
	striped = true,
	...rest
}) => <table className={classNames(className, {
	celled,
	collapsing,
	compact,
	selectable,
	sortable,
	striped
}, 'table ui')} {...rest}>{children}</table>;
