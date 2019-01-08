/* eslint-disable no-console */

export function stateReducer(internalState = {}, action) {
	console.log('stateReducer() old internalState', internalState);
	//console.log('stateReducer()', action);
	const {type, newState} = action;
	//console.log('stateReducer() type', type);
	console.log('stateReducer() newState', newState);
	switch (type) {
	case 'UPDATE':
		internalState = newState; // eslint-disable-line no-param-reassign
	default: // eslint-disable-line no-fallthrough
		console.log('stateReducer() new internalState', internalState);
		return internalState;
	}
}
