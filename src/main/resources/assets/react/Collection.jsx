/* global React */
import {get, set} from 'lodash';

// ERROR The next line cause runtime errors!
//import React, { Component } from 'react';


export class Collection extends React.Component {
	constructor(props) {
		//console.log(props);
		super(props);
		const {
			delay = 1000,
			headers,
			name = '',
			newHeaderName = '',
			pathRange,
			queryRange,
			url = ''
		} = props;
		this.state = {
			delay,
			headers,
			name,
			newHeaderName,
			pathRange,
			queryRange,
			url
		}; // Initialize state from props.
		//console.log(this.state);
		this.addHeader = this.addHeader.bind(this);
		this.addUrl = this.addUrl.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	addHeader(/*event*/) {
		//console.log(event);
		console.log(this.state);
		this.setState(state => ({
			//...state,
			headers: {...state.headers, [state.newHeaderName]: ''}
		}))
		console.log(this.state);
	}

	addUrl(event) {
		//console.log(event);
		//console.log(this.state);
		this.setState(state => ({
			url: [...state.url, '']
		}))
		//console.log(this.state);
	}

	handleInputChange({
		target: {name, value}
	}) {
		console.log(name, value);
		this.setState(state => {
			console.log(state);
			/*const emptyObj = {
				[name]: get(state, name)
			};*/
			set(state, name, value);
			console.log(state);
			return state;
		});
	}

	handleSubmit(event) {
		console.log(event);
		event.preventDefault();
		console.log(this.state);
	}

	render() {
		//console.log(this.state);
		const {
			delay,
			headers,
			name,
			newHeaderName,
			pathRange,
			queryRange,
			url
		} = this.state;
		return (
			<form onSubmit={this.handleSubmit}>
				<fieldset>
					<legend>Collection</legend>
					<label>
						<span>Name</span>
						<input name="name" value={name} onChange={this.handleInputChange}/>
					</label>
					<fieldset>
						<legend>Url</legend>
						{Array.isArray(url) ? url.map((u,i) => <input name={`url[${i}]`} onChange={this.handleInputChange} value={u}/>) : <input name="url" onChange={this.handleInputChange} value={url}/>}
						<button onClick={this.addUrl}>Add url</button>
					</fieldset>
					{
						pathRange
							? (
								<fieldset>
									<legend>Path range</legend>
									<label>
										<span>Min</span>
										<input name="pathRange[min]" onChange={this.handleInputChange} value={pathRange.min}/>
									</label>
									<label>
										<span>Max</span>
										<input name="pathRange[max]" onChange={this.handleInputChange} value={pathRange.max}/>
									</label>
								</fieldset>
							)
							: ''
					}
					{
						queryRange
							? (
								<fieldset>
									<legend>Query range</legend>
									<label>
										<span>Name</span>
										<input name="queryRange[name]" onChange={this.handleInputChange} value={queryRange.name}/>
									</label>
									<label>
										<span>Min</span>
										<input name="queryRange[min]" onChange={this.handleInputChange} value={queryRange.min}/>
									</label>
									<label>
										<span>Max</span>
										<input name="queryRange[max]" onChange={this.handleInputChange} value={queryRange.max}/>
									</label>
								</fieldset>
							)
							: ''
					}
					{
						headers
							? (
								<fieldset>
									<legend>Headers</legend>
									{
										Object.keys(headers).map(header => (
											<label>
												<span>{header}</span>
												<input name={`headers[${header}]`} onChange={this.handleInputChange} value={headers[header]}/>
											</label>
										))
									}
									<label>
										<span>New header name</span>
										<input name="newHeaderName" onChange={this.handleInputChange} value={newHeaderName}/>
										<button onClick={this.addHeader}>Add header</button>
									</label>
								</fieldset>
							)
							: ''
					}
					<label>
						<span>Delay</span>
						<input name="delay" onChange={this.handleInputChange} value={delay}/>
					</label>
				</fieldset>
			</form>
		);
	}
} // class Collection
