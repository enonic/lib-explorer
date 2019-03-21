import {connect, FieldArray} from 'formik';

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
import {ScrapeJson} from './ScrapeJson';

import {URL_OPTGROUPS} from './scrapeSubroutineConstants';
import {ScrapeExpressionBuilder} from './ScrapeExpressionBuilder';


export const CrawlField = connect(({
	formik: {
		values
	},
	fields,
	fieldsObj,
	parentPath,
	tags,
	value
}) => {
	//console.log(toStr({parentPath, value}));

	const path = `${parentPath}.crawl`;
	//console.log(toStr({path}));

	if(!value || !value.length) {
		return <SetFieldValueButton className='block' field={path} value={[{dynamic: false, urlExpr: ''}]} text="Add crawl expression(s)"/>;
	}
	return <FieldArray
		name={path}
		render={() => value.map(({crawl, download, dynamic, scrape, urlExpr}, index) => {
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
				{urlExpr ? <LabeledField autoComplete="off" label="Url extraction expression" name={`${key}.urlExpr`}/> : null}
				<ScrapeExpressionBuilder
					parentPath={key}
					name='urlExpression'
					optgroups={URL_OPTGROUPS}
				/>
				<ScrapeJson
					parentPath={path}
					fieldsObj={fieldsObj}
				/>
				<ScrapeField
					fields={fields}
					parentPath={key}
					tags={tags}
					value={scrape}
				/>
				<DownloadField
					parentPath={key}
					tags={tags}
					value={download}
				/>
				<CrawlField
					fields={fields}
					fieldsObj={fieldsObj}
					parentPath={key}
					tags={tags}
					value={crawl}
				/>{/*Recursive*/}

				<InsertButton index={index} path={path} value={{dynamic: false, urlExpr: ''}}/>
				<RemoveButton index={index} path={path}/>
				<MoveDownButton disabled={index === value.length-1} index={index} path={path} visible={value.length > 1}/>
				<MoveUpButton index={index} path={path} visible={value.length > 1}/>
			</Fieldset>
		})}
	/>;
});
