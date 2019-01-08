/* global React */
import { createStore } from 'redux';

import {stateReducer} from './stateReducer';
import {Provider} from './Provider';
import {Collection} from './Collection';


export class App extends React.Component {
	render() {
		return(
			<Provider store={createStore(stateReducer)}>
				<Collection {...this.props}/>
			</Provider>
		);
	}
} // class App

//export default App;
