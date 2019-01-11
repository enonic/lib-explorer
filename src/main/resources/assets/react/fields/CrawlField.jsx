import {FieldArray} from 'formik';
import {capitalize} from 'lodash';

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


export const CrawlField = ({fields, path, setFieldValue, value}) => {
	//console.log(JSON.stringify({path, value}, null, 4));
	if(!(value && Array.isArray(value) && value.length)) {
		return <SetFieldValueButton className='block' field={path} value={[{dynamic: false, urlExpr: ''}]} setFieldValue={setFieldValue} text="Add crawl expression(s)"/>;
	}
	return <Fieldset legend={capitalize(path)}>
		<FieldArray
			name={path}
			render={({insert, swap, remove}) => value.map(({crawl, download, dynamic, scrape, urlExpr}, index) => (
				<div key={`${path}[${index}]`}>
					<Checkbox checked={dynamic} label="Dynamic" name={`${path}[${index}].dynamic`}/>
					<LabeledField label="Url extraction expression" name={`${path}[${index}].urlExpr`}/>

					<ScrapeField fields={fields} path={`${path}[${index}].scrape`} value={scrape} setFieldValue={setFieldValue}/>
					<DownloadField path={`${path}[${index}].download`} value={download} setFieldValue={setFieldValue}/>
					<CrawlField fields={fields} path={`${path}[${index}].crawl`} value={crawl} setFieldValue={setFieldValue}/>{/*Recursive*/}

					<InsertButton index={index} insert={insert} value={{dynamic: false, urlExpr: ''}}/>
					<RemoveButton index={index} remove={remove}/>
					<MoveDownButton disabled={index === value.length-1} index={index} swap={swap} visible={value.length > 1}/>
					<MoveUpButton index={index} swap={swap} visible={value.length > 1}/>
				</div>
			))}
		/>
	</Fieldset>;
};
