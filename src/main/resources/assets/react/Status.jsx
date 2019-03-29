import classNames from 'classnames';
import moment from 'moment';
import prettyMs from 'pretty-ms';
import React from 'react';
import {Table} from './elements/Table';
import {toStr} from './utils/toStr';


const FORMAT = 'YYYY-MM-DD hh:mm:ss';


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
			'Time left',
			'Eta',
			'Progress',
			'Message'
		]}>
			{collectors.map(({
				progress: {
					current,
					info: {
						name,
						currentTime,
						startTime = currentTime,
						message
					},
					total
				},
				//startTime,
				state
			}, index) => {
				/*console.debug(toStr({
					component: 'Status',
					name,
					state,
					current,
					total,
					currentTime,
					startTime
				}));*/
				const percent = current / total * 100;
				const duration = currentTime - startTime;
				const average = duration / current;
				const left = total - current;
				const eta = currentTime + (left * average);
				/*console.debug(toStr({
					component: 'Status',
					percent,
					duration,
					average,
					left,
					eta
				}));*/
				moment.locale('nb'); // TODO use locale from backend?
				return <tr key={index}>
					<td>{name}</td>
					<td>{state}</td>
					<td data-sort-value={startTime}>{moment(Date(startTime)).format(FORMAT)}</td>
					<td data-sort-value={duration}>{prettyMs(duration, {
						formatSubMs: true,
						separateMs: true
					})}</td>
					<td data-sort-value={currentTime}>{state === 'RUNNING' ? '' : moment(Date(currentTime)).format(FORMAT)}</td>
					<td data-sort-value={current}>{current}</td>
					<td data-sort-value={total}>{total}</td>
					<td data-sort-value={left}>{left}</td>
					<td data-sort-value={average}>{prettyMs(average, {
						formatSubMs: true,
						separateMs: true
					})}</td>
					<td data-sort-value={eta}>{state === 'RUNNING' ? prettyMs(eta, {
						formatSubMs: true,
						separateMs: true
					}) : null}</td>
					<td data-sort-value={eta}>{state === 'RUNNING' ? moment(Date(eta)).format(FORMAT) : null}</td>
					<td data-sort-value={percent}><div
						className={classNames(
							'ui',
							'progress',
							taskStateToProgressClassName(state)
						)}
						data-percent={percent}
						data-total={total}
						data-value={current}
					>
						<div className="bar">
	    					<div className="progress"></div>
	  					</div>
					</div></td>
					<td>{message}</td>
				</tr>;})}
		</Table>;
	}
} // class Status
