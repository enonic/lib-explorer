// Buttons
import {InsertButton} from '../buttons/InsertButton';
import {MoveUpButton} from '../buttons/MoveUpButton';
import {MoveDownButton} from '../buttons/MoveDownButton';
import {RemoveButton} from '../buttons/RemoveButton';
import {SetFieldValueButton} from '../buttons/SetFieldValueButton';

// Elements
import {Checkbox} from '../elements/Checkbox';
import {Fieldset} from '../elements/Fieldset';
import {Label} from '../elements/Label';
import {LabeledField} from '../elements/LabeledField';
//import {Table} from '../elements/Table';

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
import {UrlsField} from './UrlsField';


export const Surgeon = ({
	fields,
	path,
	setFieldValue,
	tags,
	values
}) => {
	const {
		collector: {
			name: collectorName,
			config: {
				crawl,
				delay,
				download,
				dynamic,
				pathRange,
				queryParams,
				queryRange,
				headers,
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
		<PathRangeField path={`${path}.pathRange`} pathRange={pathRange} setFieldValue={setFieldValue}/>
		<QueryRangeField path={`${path}.queryRange`} queryRange={queryRange} setFieldValue={setFieldValue}/>
		<QueryParameters parentPath={path} setFieldValue={setFieldValue} value={queryParams}/>
		<HeadersField path={`${path}.headers`} headers={headers} setFieldValue={setFieldValue}/>
		<DelayField path={`${path}.delay`} value={delay}/>
		<Checkbox checked={dynamic} label="Dynamic" name={`${path}.dynamic`}/>
	</Fieldset>
	<ScrapeField
		fields={fields}
		parentPath={path}
		setFieldValue={setFieldValue}
		tags={tags}
		value={scrape}
		values={values}
	/>
	<DownloadField
		parentPath={path}
		setFieldValue={setFieldValue}
		tags={tags}
		value={download}
		values={values}
	/>
	<CrawlField
		fields={fields}
		parentPath={path}
		setFieldValue={setFieldValue}
		tags={tags}
		value={crawl}
		values={values}
	/>
</>};
