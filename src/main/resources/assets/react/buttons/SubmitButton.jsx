import {Button} from './Button';
import {Icon} from '../icons/Icon';


export const SubmitButton = ({text, ...rest}) =>
	<Button type="submit" {...rest}><Icon className='save outline'/>{text}</Button>;
