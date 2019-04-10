//import '@babel/runtime';
import Uri from 'jsuri';
import {
	Checkbox, Divider, Dropdown, Form, Header, Icon, Label, Pagination, Rail,
	Ref, Segment, Sticky, Table
} from 'semantic-ui-react'
import {createRef} from 'react'


export class Journals extends React.Component {
	constructor(props) {
    	super(props);

    	this.state = {
			columns: {
				name: true,
				startTime: false,
				endTime: true,
				duration: false,
				errorCount: true,
				successCount: false
			},
			params: {
				collections: [],
				perPage: 5,
				page: 1,
				query: '',
				sort: 'endTime DESC'
			},
			result: {
				aggregations: {
					collection: {
						buckets: []
					}
				},
				count: 0,
				page: 1,
				total: 0,
				totalPages: 0,
				hits: []
			}
    	};

		this.handleInputChange = this.handleInputChange.bind(this);
		this.handlePaginationChange = this.handlePaginationChange.bind(this);
	} // constructor


	search() {
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


	componentDidMount() {
		this.search();
	}


	handleCheckboxChange = (e, {checked, name}) => this.setState(prevState => {
		//console.debug({checked, name});
		prevState.columns[name] = checked;
		return prevState;
	});


  	async handleInputChange(e, {name, value}) {
		//console.debug({name, value});
		await this.setState(prevState => {
			prevState.params[name] = value;
			return prevState;
		});
		this.search();
	}


	async handlePaginationChange(e, {activePage}) {
		await this.setState(prevState => {
			prevState.params.page = activePage;
			return prevState;
		});
		this.search();
	}


	render() {
		//console.debug({state: this.state});
		const {
			columns,
			params,
			result: {
				aggregations,
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
				<Table celled compact selectable sortable striped attached='top'>
					<Table.Header>
      					<Table.Row>
							{columns.name ? <Table.HeaderCell>Collection</Table.HeaderCell> : null}
        					{columns.startTime ? <Table.HeaderCell>Start</Table.HeaderCell> : null}
        					{columns.endTime ? <Table.HeaderCell>End</Table.HeaderCell> : null}
							{columns.duration ? <Table.HeaderCell>Duration</Table.HeaderCell> : null}
							{columns.errorCount ? <Table.HeaderCell>Errors</Table.HeaderCell> : null}
							{columns.successCount ? <Table.HeaderCell>Successes</Table.HeaderCell> : null}
      					</Table.Row>
    				</Table.Header>
					<Table.Body>
						{hits.map(({name, startTime, endTime, duration, errorCount, successCount}, i) => <Table.Row key={i}>
        					{columns.name ? <Table.Cell>{name}</Table.Cell> : null}
							{columns.startTime ? <Table.Cell>{startTime}</Table.Cell> : null}
							{columns.endTime ? <Table.Cell>{endTime}</Table.Cell> : null}
							{columns.duration ? <Table.Cell>{duration}</Table.Cell> : null}
							{columns.errorCount ? <Table.Cell>{errorCount}</Table.Cell> : null}
							{columns.successCount ? <Table.Cell>{successCount}</Table.Cell> : null}
						</Table.Row>)}
					</Table.Body>
				</Table>
				<Pagination
					attached='bottom'
					fluid
					size='mini'

					activePage={page}
					boundaryRange={1}
				    siblingRange={1}
					totalPages={totalPages}

					ellipsisItem={{content: <Icon name='ellipsis horizontal' />, icon: true}}
				    firstItem={{content: <Icon name='angle double left' />, icon: true}}
					prevItem={{content: <Icon name='angle left' />, icon: true}}
					nextItem={{content: <Icon name='angle right' />, icon: true}}
				    lastItem={{content: <Icon name='angle double right' />, icon: true}}

					onPageChange={this.handlePaginationChange}
				/>
				<Rail position='left'>
					<Sticky context={contextRef} offset={14}>
						<Segment basic>
							<Form>
								<Form.Field>
									<Header as='h4'><Icon name='database'/> Collections</Header>
									<Dropdown
										fluid
										multiple={true}
										name='collections'
										onChange={this.handleInputChange}
										options={aggregations.collection.buckets.map(({key, docCount}) => ({key, text: `${key} (${docCount})`, value: key}))}
										search
										selection
										value={params.collections}
									/>
								</Form.Field>
								<Divider hidden/>
								<Form.Field>
									<Header as='h4'><Icon name='resize vertical'/> Per page</Header>
									<Dropdown
										fluid
										name='perPage'
										onChange={this.handleInputChange}
										options={[5,10,25,50,100].map(key => ({key, text: `${key}`, value: key}))}
										selection
										value={params.perPage}
									/>
								</Form.Field>
							</Form>
						</Segment>
					</Sticky>
				</Rail>
				<Rail position='right'>
					<Sticky context={contextRef} offset={14}>
						<Segment basic>
							<Header as='h4'><Icon name='columns'/> Columns</Header>
							<Form>
								<Form.Field>
									<Checkbox
										checked={this.state.columns.name}
										label='Collection'
										name='name'
										onChange={this.handleCheckboxChange}
										toggle
									/>
								</Form.Field>
								<Form.Field>
									<Checkbox
										checked={this.state.columns.startTime}
										label='Start time'
										name='startTime'
										onChange={this.handleCheckboxChange}
										toggle
									/>
								</Form.Field>
								<Form.Field>
									<Checkbox
										checked={this.state.columns.endTime}
										label='End time'
										name='endTime'
										onChange={this.handleCheckboxChange}
										toggle
									/>
								</Form.Field>
								<Form.Field>
									<Checkbox
										checked={this.state.columns.duration}
										label='Duration'
										name='duration'
										onChange={this.handleCheckboxChange}
										toggle
									/>
								</Form.Field>
								<Form.Field>
									<Checkbox
										checked={this.state.columns.errorCount}
										label='Errors'
										name='errorCount'
										onChange={this.handleCheckboxChange}
										toggle
									/>
								</Form.Field>
								<Form.Field>
									<Checkbox
										checked={this.state.columns.successCount}
										label='Successes'
										name='successCount'
										onChange={this.handleCheckboxChange}
										toggle
									/>
								</Form.Field>
							</Form>
						</Segment>
					</Sticky>
				</Rail>
			</Segment>
		</Ref>;
	}
} // Journals
