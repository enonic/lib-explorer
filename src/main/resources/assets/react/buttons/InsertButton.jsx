//import {toStr} from '../utils/toStr';


export const InsertButton = ({index, insert, value}) => {
	//console.debug(toStr({index, value}));
	return <button type="button" onClick={() => insert(index+1, value)}>+</button>;
}
