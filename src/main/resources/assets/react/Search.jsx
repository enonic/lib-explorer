import {Form, Formik} from 'formik';

import {Select} from './elements/Select';

import {Hits} from './search/Hits';

import {Field} from './semantic-ui/Field';
import {Fields} from './semantic-ui/Fields';
import {Header} from './semantic-ui/Header';
import {Label} from './semantic-ui/Label';
import {Labels} from './semantic-ui/Labels';
import {SearchInput} from './semantic-ui/SearchInput';

//import {toStr} from './utils/toStr';


export class Search extends React.Component {
	constructor(props) {
    	super(props);

    	this.state = {
      		cache: {},
			searchString: ''
    	};

		this.handleChange = this.handleChange.bind(this);
  	} // constructor


	search({
		searchString
	} = {}) {
		if(!searchString) {return;}
		const {serviceUrl} = this.props;
		const uri = `${serviceUrl}&name=searchString&searchString=${searchString}`;
		fetch(uri)
			.then(response => response.json())
			.then(data => this.setState(prevState => ({
				cache: {
					...prevState.cache,
					[`${searchString}`]: data
				}
			})));
	}


	/* componentDidMount is invoked immediately after a component is mounted
	(inserted into the tree). Initialization that requires DOM nodes should go
	here. If you need to load data from a remote endpoint, this is a good place
	to instantiate the network request.*/
	//componentDidMount() {
	//} // componentDidMount


	handleChange(syntheticEvent) {
		//console.debug(syntheticEvent);
		const {
			target: {
				name,
				value: searchString
			}
		} = syntheticEvent;
		//console.debug(name, searchString);
		if (name === 'search') {
			this.setState({searchString});
			if (!this.state.cache[searchString]) {
				this.search({searchString});
			}
		}
	} // handleChange


	render() {
		const {
			collectionOptions = [],
			thesaurusOptions = [],
			initialValues = {}
		} = this.props;
		const {cache, searchString} = this.state;
		const data = searchString && cache[searchString];
		const hits = data ? data.hits : [];
		const synonyms = data ? data.synonyms : [];
		const loading = searchString && !data;
		/*console.debug(toStr({
			component: 'Search',
			//collections,
			//thesauri,
			//initialValues,
			searchString,
			loading
		}));*/
		return <Formik
			initialValues={initialValues}
			render={({
				handleChange,
				values: {
					collections = [],
					thesauri = []
				}
			}) => {
				/*console.debug(toStr({
					component: 'Search Formik',
					collections,
					thesauri
				}));*/
				return <>
					<Form
						style={{
							width: '100%'
						}}
					>
						<Fields>
							{/*<Field>
								<Select
									label="Collections"
									multiple={true}
									name="collections"
									options={collectionOptions}
									value={collections}
								/>
							</Field>
							<Field>
								<Select
									label="Thesauri"
									multiple={true}
									name="thesauri"
									options={thesaurusOptions}
									value={thesauri}
								/>
							</Field>*/}
							<Field>
								<SearchInput
									fluid
									loading={loading}
									onChange={syntheticEvent => {
										handleChange(syntheticEvent);
										this.handleChange(syntheticEvent);
									}}
								/>
							</Field>
						</Fields>
					</Form>
					{synonyms.length ? <>
						<Header dividing text='Synonyms'/>
						<Labels mini>{synonyms.map((s, i) => <Label basic key={i} text={s}/>)}</Labels>
					</> : null}
					<Hits
						hits={hits}
						loading={loading}
					/>
				</>;
			}}
		/>;
	} // render
} // Search Component
