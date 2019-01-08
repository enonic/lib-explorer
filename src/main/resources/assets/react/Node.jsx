/* global React */
import {get, set} from 'lodash';
import traverse from 'traverse';


const ID_NEW_FIELD_NAME = 'newFieldName';

export class Node extends React.Component {
	constructor(props) {
		console.log(props);
		super(props);
		const {
			scrape,
			download
		} = props;
		this.state = {
			scrape,
			download
		};
		//console.log(this.state);
		this.addField = this.addField.bind(this);
	}

	addField(/*event*/) {
		//console.log(event);
		const {value} = document.getElementById(ID_NEW_FIELD_NAME);
		this.setState(state => {
			const {scrape} = state;
			set(scrape, value, '');
			//console.log(scrape);
			return {scrape};
		});
		//console.log(this.state);
	}

	static sayHello() {
		console.log('Hello');
	}

	sayState() {
		console.log(this.state);
	}

	render() {
		const {scrape} = this.state;
		//console.log('scrape', scrape);
		const leaves = traverse(scrape).reduce(function(acc, value) { // Fat arrow destroys this here!
			if (this.isLeaf && this.notRoot) {
				const {path} = this;
				const joined = path.join('.');
				acc.push((<label>
					<span>{joined}</span>
					<input name={`scrape.${joined}`} value={value}/>
				</label>));
			}
			return acc;
		}, []);
		//console.log('leaves', JSON.stringify(leaves)); // Circular...
		return (
			<fieldset>
				<legend>Node</legend>
				<fieldset>
					<legend>Scrape</legend>
					{leaves}
					<label>
						<span>Field</span>
						<select id={ID_NEW_FIELD_NAME}>
							<option value="grape.fruit">Grapefruit</option>
							<option value="lime">Lime</option>
							<option value="coconut">Coconut</option>
							<option value="mango">Mango</option>
						</select>
						<button onClick={this.addField} type="button">Add field</button>
					</label>
				</fieldset>
			</fieldset>
		);
	}
}
