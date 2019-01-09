import {CrawlField} from './CrawlField';
import {DownloadField} from './DownloadField';
import {ScrapeField} from './ScrapeField';


export const NodeField = ({path, setFieldValue, value}) => <div>
	<ScrapeField path={`${path}.scrape`} value={value && value.scrape} setFieldValue={setFieldValue}/>
	<DownloadField path={`${path}.download`} value={value && value.download} setFieldValue={setFieldValue}/>
	<CrawlField path={`${path}.crawl`} value={value && value.crawl} setFieldValue={setFieldValue}/>
</div>;
