import {FieldArray} from 'formik';

import {InsertButton} from '../buttons/InsertButton';
import {MoveUpButton} from '../buttons/MoveUpButton';
import {MoveDownButton} from '../buttons/MoveDownButton';
import {RemoveButton} from '../buttons/RemoveButton';
import {SetFieldValueButton} from '../buttons/SetFieldValueButton';

import {Checkbox} from '../elements/Checkbox';
import {Fieldset} from '../elements/Fieldset';
import {LabeledField} from '../elements/LabeledField';

import {DownloadField} from './DownloadField';
import {ScrapeField} from './ScrapeField';


export const CrawlField = ({path, setFieldValue, value}) => {
	console.log(JSON.stringify({path, value}, null, 4));
	if(!(value && Array.isArray(value) && value.length)) {
		return <SetFieldValueButton field={path} value={[{dynamic: false, urlExpr: ''}]} setFieldValue={setFieldValue} text="Add crawl expression(s)"/>;
	}
	return <FieldArray
		name={path}
		render={({insert, swap, remove}) => value.map(({crawl, download, dynamic, scrape, urlExpr}, index) => (
			<Fieldset key={`${path}[${index}]`} legend={`${path}[${index}]`}>
				<Checkbox checked={dynamic} label="Dynamic" name={`${path}[${index}].dynamic`}/>
				<LabeledField label="Url extraction expression" name={`${path}[${index}].urlExpr`}/>

				<ScrapeField path={`${path}[${index}].scrape`} value={scrape} setFieldValue={setFieldValue}/>
				<DownloadField path={`${path}[${index}].download`} value={download} setFieldValue={setFieldValue}/>
				<CrawlField path={`${path}[${index}].crawl`} value={crawl} setFieldValue={setFieldValue}/>{/*Recursive*/}

				<RemoveButton index={index} remove={remove}/>
				{index ? <MoveUpButton index={index} swap={swap}/> : null}
				{index < value.length-1 ? <MoveDownButton index={index} swap={swap}/> : null}
				<InsertButton index={index} insert={insert} value={{dynamic: false, urlExpr: ''}}/>
			</Fieldset>
		))}
	/>;
};
