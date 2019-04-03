import {Form, Formik} from 'formik';

import {Select} from './elements/Select';

import {Field} from './semantic-ui/Field';
import {Fields} from './semantic-ui/Fields';
import {SearchInput} from './semantic-ui/SearchInput';

//import {toStr} from './utils/toStr';


export class Search extends React.Component {
	constructor(props) {
    	super(props);

    	this.state = {
      		collectors: [],
			isLoading: false
    	};
  	}

	componentDidMount() {
		const {serviceUrl} = this.props;
	} // componentDidMount

	render() {
		const {
			collectionOptions = [],
			thesaurusOptions = [],
			initialValues = {}
		} = this.props;
		/*console.debug(toStr({
			component: 'Search',
			//collections,
			//thesauri,
			initialValues
		}));*/
		return <Formik
			initialValues={initialValues}
			render={({
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
				return <Form
					style={{
						width: '100%'
					}}
				>
					<Fields>
						<Field>
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
						</Field>
						<Field>
							<SearchInput fluid/>
						</Field>
					</Fields>
				</Form>;
			}}
		/>;
	} // render
} // Search Component
