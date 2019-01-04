import React, { Component } from 'react';


export class Collection extends Component {
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
