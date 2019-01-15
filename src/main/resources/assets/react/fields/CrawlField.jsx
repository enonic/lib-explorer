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

//import {toStr} from '../utils/toStr';

import {DownloadField} from './DownloadField';
import {ScrapeField} from './ScrapeField';


export const CrawlField = ({
	fields,
	parentPath,
	setFieldValue,
	tags,
	value,
	values
}) => {
	//console.log(toStr({parentPath, value}));

	const path = `${parentPath}.crawl`;
	//console.log(toStr({path}));

	if(!value || !value.length) {
		return <SetFieldValueButton className='block' field={path} value={[{dynamic: false, urlExpr: ''}]} setFieldValue={setFieldValue} text="Add crawl expression(s)"/>;
	}
	return <FieldArray
		name={path}
		render={({insert, swap, remove}) => value.map(({crawl, download, dynamic, scrape, urlExpr}, index) => {
			//console.log(toStr({crawl, download, dynamic, scrape, urlExpr, index}));

			const key = `${path}[${index}]`;
			//console.log(toStr({key}));

			return <Fieldset key={key} legend={`Crawl ${key
				.replace(/^collector\.config/, '')
				.replace(/\.crawl\[/g, '')
				.replace(/\]$/, '')
				.replace(/\]/g, ', ')
				.replace(/([^\d]*)(\d+)([^\d]*)/g, (match, before, digits, after/*, offset, string*/) => {
					//console.log({match, before, digits, after, offset, string});
					return `${before}${parseInt(digits) + 1}${after}`;
				})
			}`}>
				<Checkbox checked={dynamic} label="Dynamic" name={`${key}.dynamic`}/>
				<LabeledField autoComplete="off" label="Url extraction expression" name={`${key}.urlExpr`}/>

				<ScrapeField
					fields={fields}
					parentPath={key}
					setFieldValue={setFieldValue}
					tags={tags}
					value={scrape}
					values={values}
				/>
				<DownloadField
					parentPath={key}
					setFieldValue={setFieldValue}
					tags={tags}
					value={download}
					values={values}
				/>
				<CrawlField
					fields={fields}
					parentPath={key}
					setFieldValue={setFieldValue}
					value={crawl}
					values={values}
				/>{/*Recursive*/}

				<InsertButton index={index} insert={insert} value={{dynamic: false, urlExpr: ''}}/>
				<RemoveButton index={index} remove={remove}/>
				<MoveDownButton disabled={index === value.length-1} index={index} swap={swap} visible={value.length > 1}/>
				<MoveUpButton index={index} swap={swap} visible={value.length > 1}/>
			</Fieldset>
		})}
	/>;
};
