/* global React */
/* eslint-disable no-console */
import PropTypes from 'prop-types';


export class Provider extends React.Component {
	constructor(props/*, context*/) {
		console.log('Provider constructor() props', props);
		//console.log('Provider constructor() context', context);
		super(props);
	}

	getChildContext() {
		console.log('Provider getChildContext() this.props', this.props);
		return {
			store: this.props.store
		};
	}

	render() {
		//console.log('Provider render() this.props', this.props);
		return this.props.children;
	}
} // class Provider


// Which context do we want to pass down
Provider.childContextTypes = {
	store: PropTypes.object
};
