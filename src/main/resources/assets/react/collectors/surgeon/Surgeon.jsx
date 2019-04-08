import {connect} from 'formik';

// Elements
import {Checkbox} from '../../elements/Checkbox';
import {Fieldset} from '../../elements/Fieldset';
import {Label} from '../../elements/Label';
import {LabeledField} from '../../elements/LabeledField';

import {isSet} from '../../utils/isSet';
//import {toStr} from '../utils/toStr';

import {Crawl} from './Crawl';
import {Delay} from './Delay';
//import {Download} from './Download';
import {Cookies} from '../../http/Cookies';
import {Headers} from './Headers';
import {PathRange} from './PathRange';
import {QueryParameters} from './QueryParameters';
import {QueryRange} from './QueryRange';
import {Scrape} from './Scrape';
import {Urls} from './Urls';


export const Surgeon = connect(({
	formik: {
		values
	},
	fields,
	path
}) => {
	const {
		collector: {
			config: {
				crawl,
				connectionTimeout = 10000,
				delay = 1000,
				download = [],
				dynamic = false,
				pathRange,
				queryParams,
				queryRange,
				headers,
				readTimeout = 10000,
				retries = 1,
				scrape,
				urls = [''] // At least one is required
			} = {}
		}
	} = values;
	/*console.log(toStr({
		fields,
		path,
		crawl/*,
		delay,
		dynamic,
		download,
		pathRange,
		queryParams,
		queryRange,
		headers,
		scrape,
		urls
	}));*/
	return <>
	<Urls parentPath={path} value={urls}/>
	<PathRange path={`${path}.pathRange`} pathRange={pathRange}/>
	<QueryRange path={`${path}.queryRange`} queryRange={queryRange}/>
	<QueryParameters parentPath={path} value={queryParams}/>
	<Cookies parentPath={path}/>
	<Headers path={`${path}.headers`} headers={headers}/>
	<Delay path={`${path}.delay`} value={delay}/>
	<LabeledField label="Connection timeout" name={`${path}.connectionTimeout`} value={isSet(connectionTimeout) ? connectionTimeout : 10000}/>
	<LabeledField label="Read timeout" name={`${path}.readTimeout`} value={isSet(readTimeout) ? readTimeout : 10000}/>
	<LabeledField label="Retries" name={`${path}.retries`} value={isSet(retries) ? retries : 1}/>
	<Checkbox checked={dynamic} label="Dynamic" name={`${path}.dynamic`}/>
	<Scrape
		fields={fields}
		parentPath={path}
		value={scrape}
	/>
	{/*<Download
		fields={fields}
		parentPath={path}
		tags={tags}
		value={download}
	/>*/}
	<Crawl
		fields={fields}
		parentPath={path}
		value={crawl}
	/>
</>});
