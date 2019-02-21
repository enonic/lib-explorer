//import {toStr} from '../utils/toStr';


export const InsertButton = ({index, insert, text = '+', value}) => {
	//console.debug(toStr({index, value}));
	return <button type="button" onClick={() => insert(index+1, value)}>{text}</button>;
}
