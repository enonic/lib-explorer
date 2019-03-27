import classNames from 'classnames';


export const Table = ({
	children,
	className,
	...rest
}) => <table className={classNames(className, 'celled compact selectable striped table ui')} {...rest}>{children}</table>;
