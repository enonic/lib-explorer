import classNames from 'classnames';
//import {toStr} from '../utils/toStr';


export const Header = ({
	block,
	children,
	className,
	dividing,
	h1,
	h2,
	h3,
	h4,
	h5,
	h6,
	huge,
	large,
	medium,
	small,
	text,
	tiny,
	...rest
}) => {
	const Tag = classNames({h1})
		|| classNames({h2})
		|| classNames({h3})
		|| classNames({h4})
		|| classNames({h5})
		|| classNames({h6})
		|| 'div';
	//console.debug(toStr({component: 'Header', className, dividing, Tag, rest}));
	return <Tag className={classNames(className, {
		block,
		dividing,
		huge,
		large,
		medium,
		small,
		tiny
	}, 'ui header')} {...rest}>{children || text}</Tag>;
}
