import Uri from 'jsuri';
import {Icon, Pagination, Rail, Ref, Segment, Sticky, Table} from 'semantic-ui-react'
import {createRef} from 'react'


export class Journals extends React.Component {
	constructor(props) {
    	super(props);

    	this.state = {
			params: {
				perPage: 5,
				page: 1,
				query: '',
				sort: 'endTime DESC'
			},
			result: {
				count: 0,
				page: 1,
				total: 0,
				totalPages: 0,
				hits: []
			}
    	};

		this.search();
	}

	search = () => {
		const {serviceUrl} = this.props;
		const uri = new Uri(serviceUrl);
		Object.entries(this.state.params).forEach(([k, v]) => {
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

	//handleCheckboxChange = (e, { checked, name }) => this.setState({ [name]: checked })

  	//handleInputChange = (e, { name, value }) => this.setState({ [name]: value })

	handlePaginationChange = (e, { activePage }) => this.setState(prevState => {
		prevState.params.page = activePage;
		this.search();
	})

	render() {
		//console.debug({state: this.state});
		const {
			result: {
				count,
				page,
				total,
				totalPages,
				hits
			}
		} = this.state;
		//console.debug({count, page, total, totalPages, hits});

		const contextRef = createRef();
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
				<Pagination
					activePage={page}
					boundaryRange={1}
				    siblingRange={1}
					totalPages={totalPages}

					ellipsisItem={{content: <Icon name='ellipsis horizontal' />, icon: true}}
				    firstItem={{content: <Icon name='angle double left' />, icon: true}}
					prevItem={{content: <Icon name='angle left' />, icon: true}}
					nextItem={{content: <Icon name='angle right' />, icon: true}}
				    lastItem={{content: <Icon name='angle double right' />, icon: true}}
					size='mini'

					onPageChange={this.handlePaginationChange}
				/>
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
