import classNames from 'classnames';


export const Table = ({
	children,
	className,
	basic = false,
	celled = false,
	collapsing = false,
	compact = false,
	selectable = false,
	small = false,
	sortable = false,
	striped = false,
	very = false,
	...rest
}) => <table className={classNames(className, {
	basic,
	celled,
	collapsing,
	compact,
	selectable,
	small,
	sortable,
	striped,
	very
}, 'table ui')} {...rest}>{children}</table>;
