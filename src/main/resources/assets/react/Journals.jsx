import Uri from 'jsuri';
import {Menu, Rail, Ref, Segment, Sticky, Table} from 'semantic-ui-react'
import {createRef} from 'react'


export class Journals extends React.Component {
	constructor(props) {
    	super(props);

    	this.state = {
      		//cache: {}
			result: {
				count: 0,
				total: 0,
				hits: []
			}
    	};

		const {serviceUrl} = this.props;
		const uri = new Uri(serviceUrl);
		const params = {
			perPage: 5,
			page: 1,
			query: '',
			sort: 'endTime DESC'
		};
		Object.entries(params).forEach(([k, v]) => {
			//console.debug({k, v});
			uri.replaceQueryParam(k, v);
		});
		const uriStr = uri.toString();
		//console.debug({uriStr});
		fetch(uriStr)
			.then(response => response.json())
			.then(data => {
				//console.debug({data});
				this.setState({result: data.result});
			})
	}


	render() {
		const contextRef = createRef();
		const {count, total, hits} = this.state.result;
		//console.debug({count, total, hits});

		return <Ref innerRef={contextRef}>
			<Segment basic>
				<Table celled compact selectable sortable striped>
					<Table.Header>
      					<Table.Row>
        					<Table.HeaderCell>Collection</Table.HeaderCell>
        					<Table.HeaderCell>Start</Table.HeaderCell>
        					<Table.HeaderCell>End</Table.HeaderCell>
							<Table.HeaderCell>Duration</Table.HeaderCell>
							<Table.HeaderCell>Errors</Table.HeaderCell>
							<Table.HeaderCell>Successes</Table.HeaderCell>
      					</Table.Row>
    				</Table.Header>
					<Table.Body>
						{hits.map(({name, startTime, endTime, duration, errorCount, successCount}, i) => <Table.Row key={i}>
        					<Table.Cell>{name}</Table.Cell>
							<Table.Cell>{startTime}</Table.Cell>
							<Table.Cell>{endTime}</Table.Cell>
							<Table.Cell>{duration}</Table.Cell>
							<Table.Cell>{errorCount}</Table.Cell>
							<Table.Cell>{successCount}</Table.Cell>
						</Table.Row>)}
					</Table.Body>
				</Table>
				<Rail position='left'>
					<Sticky context={contextRef} offset={14}>
						<Segment>Left</Segment>
					</Sticky>
				</Rail>
				<Rail position='right'>
					<Sticky context={contextRef} offset={14}>
						<Segment>Right</Segment>
					</Sticky>
				</Rail>
			</Segment>
		</Ref>;
	}
} // Journals
