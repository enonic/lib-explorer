/* global React */

// ERROR The next line cause runtime errors!
//import React, { Component } from 'react';


export class Collection extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			name: null
		};
	}

	render() {
		const {name} = this.props;
		return (
			<div>
				<h1>Collection</h1>
			</div>
		);
	}
} // class Collection
//				<input name="name" type="text" value="{name}"/>
