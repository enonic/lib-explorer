import classNames from 'classnames';
import moment from 'moment';
import prettyMs from 'pretty-ms';
import React from 'react';
import {Table} from './elements/Table';
import {toStr} from './utils/toStr';


function taskStateToProgressClassName(state) {
	switch (state) {
	case 'RUNNING': return 'active';
	case 'FINISHED': return 'success';
	case 'WAITING': return 'warning';
	//case 'FAILED': return 'error';
	default: return 'error';
	}
}


export class Status extends React.Component {
	constructor(props) {
    	super(props);

    	this.state = {
      		collectors: [],
			isLoading: false
    	};
  	}


	componentDidMount() {
		const {serviceUrl} = this.props;

		this.interval = setInterval(() => {
			this.setState({ isLoading: true });
			fetch(serviceUrl)
	      		.then(response => response.json())
	      		.then(data => this.setState({
					collectors: data,
					isLoading: false
				}));
		}, 2000);
  	}


	componentWillUnmount() {
	  clearInterval(this.interval);
	}


	render() {
		/*console.debug(toStr({
			component: 'Status',
			props: this.props,
			state: this.state
		}));*/
		const {collectors} = this.state;
		return <Table className='sortable' headers={[
			'Collection',
			'State',
			'Start time',
			'Duration',
			'End time',
			'Current',
			'Total',
			'Left',
			'Average',
			'Eta',
			'Progress',
			'Uri'
		]}>
			{collectors.map(({
				progress: {
					current,
					info: {
						name,
						currentTime,
						startTime = currentTime,
						url
					},
					total
				},
				//startTime,
				state
			}, index) => {
				console.debug(toStr({
					component: 'Status',
					name,
					state,
					current,
					total,
					currentTime,
					startTime
				}));
				const duration = currentTime - startTime;
				const average = duration / current;
				const left = total - current;
				const eta = left * average;
				console.debug(toStr({
					component: 'Status',
					duration,
					average,
					left,
					eta
				}));
				return <tr key={index}>
					<td>{name}</td>
					<td>{state}</td>
					<td>{moment(startTime).format('LLL')}</td>
					<td>{prettyMs(duration)}</td>
					<td>{state === 'RUNNING' ? '' : moment(currentTime).format('LLL')}</td>
					<td>{current}</td>
					<td>{total}</td>
					<td>{left}</td>
					<td>{prettyMs(average)}</td>
					<td>{moment(eta).format('LLL')}</td>
					<td><div
						className={classNames(
							'ui',
							'progress',
							taskStateToProgressClassName(state)
						)}
						data-value={current}
						data-total={total}
					>
						<div className="bar">
	    					<div className="progress"></div>
	  					</div>
					</div></td>
					<td>{url}</td>
				</tr>;})}
		</Table>;
	}
} // class Status
