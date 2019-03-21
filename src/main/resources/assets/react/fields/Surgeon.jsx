import {connect} from 'formik';

// Elements
import {Checkbox} from '../elements/Checkbox';
import {Fieldset} from '../elements/Fieldset';
import {Label} from '../elements/Label';
import {LabeledField} from '../elements/LabeledField';
//import {Table} from '../elements/Table';

import {isSet} from '../utils/isSet';
//import {toStr} from '../utils/toStr';

// Fields
import {CrawlField} from './CrawlField';
import {DelayField} from './DelayField';
import {DownloadField} from './DownloadField';
import {HeadersField} from './HeadersField';
import {PathRangeField} from './PathRangeField';
import {QueryParameters} from './QueryParameters';
import {QueryRangeField} from './QueryRangeField';
import {ScrapeField} from './ScrapeField';
import {ScrapeJson} from './ScrapeJson';
import {UrlsField} from './UrlsField';


export const Surgeon = connect(({
	formik: {
		values
	},
	fields,
	fieldsObj,
	path,
	tags
}) => {
	const {
		collector: {
			name: collectorName,
			config: {
				crawl,
				connectionTimeout,
				delay,
				download,
				dynamic,
				pathRange,
				queryParams,
				queryRange,
				headers,
				readTimeout,
				retries,
				scrape,
				urls
			}
		}
	} = values;
	/*console.log(toStr({
		fields,
		path,
		collectorName,
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
	<Fieldset legend="Request">
		<UrlsField parentPath={path} value={urls}/>
		<PathRangeField path={`${path}.pathRange`} pathRange={pathRange}/>
		<QueryRangeField path={`${path}.queryRange`} queryRange={queryRange}/>
		<QueryParameters parentPath={path} value={queryParams}/>
		<HeadersField path={`${path}.headers`} headers={headers}/>
		<DelayField path={`${path}.delay`} value={delay}/>
		<LabeledField label="Connection timeout" name={`${path}.connectionTimeout`} value={isSet(connectionTimeout) ? connectionTimeout : 10000}/>
		<LabeledField label="Read timeout" name={`${path}.readTimeout`} value={isSet(readTimeout) ? readTimeout : 10000}/>
		<LabeledField label="Retries" name={`${path}.retries`} value={isSet(retries) ? retries : 1}/>
		<Checkbox checked={dynamic} label="Dynamic" name={`${path}.dynamic`}/>
	</Fieldset>
	<ScrapeJson
		parentPath={path}
		fieldsObj={fieldsObj}
	/>
	<ScrapeField
		fields={fields}
		fieldsObj={fieldsObj}
		parentPath={path}
		tags={tags}
		value={scrape}
	/>
	<DownloadField
		fields={fields}
		parentPath={path}
		tags={tags}
		value={download}
	/>
	<CrawlField
		fields={fields}
		fieldsObj={fieldsObj}
		parentPath={path}
		tags={tags}
		value={crawl}
	/>
</>});
