import {connect, FieldArray} from 'formik';

import {InsertButton} from '../../buttons/InsertButton';
import {MoveUpButton} from '../../buttons/MoveUpButton';
import {MoveDownButton} from '../../buttons/MoveDownButton';
import {RemoveButton} from '../../buttons/RemoveButton';
import {SetButton} from '../../buttons/SetButton';

import {Checkbox} from '../../elements/Checkbox';
import {Fieldset} from '../../elements/Fieldset';
import {LabeledField} from '../../elements/LabeledField';

import {Buttons} from '../../semantic-ui/Buttons';
import {Field} from '../../semantic-ui/Field';
import {Header} from '../../semantic-ui/Header';
import {Icon} from '../../semantic-ui/Icon';

//import {toStr} from '../../utils/toStr';

//import {Download} from './Download';
import {Scrape} from './Scrape';

import {URL_OPTGROUPS} from './scrapeSubroutineConstants';
import {ScrapeExpressionBuilder} from './ScrapeExpressionBuilder';

import {replaceIndexWithDigit} from './replaceIndexWithDigit';
import {replacePathWithDot} from './replacePathWithDot';


export const Crawl = connect(({
	formik: {
		values
	},
	fields,
	parentPath,
	value
}) => {
	//console.log(toStr({parentPath, value}));

	const path = `${parentPath}.crawl`;
	//console.log(toStr({path}));

	if(!value || !value.length) {
		//console.log(toStr({path}));
		const level = replaceIndexWithDigit(replacePathWithDot(path)).replace('.crawl', '1');
		//console.log(toStr({level}));
		return <Field>
			<SetButton className='block' field={path} value={[{dynamic: false, urlExpr: ''}]}><Icon className='green plus'/> Add crawl {level}</SetButton>
		</Field>;
	}
	return <FieldArray
		name={path}
		render={() => value.map(({crawl, download, dynamic, scrape}, index) => {
			//console.log(toStr({crawl, download, dynamic, scrape, urlExpr, index}));

			const key = `${path}[${index}]`;
			//console.log(toStr({key}));

			const level = replaceIndexWithDigit(replacePathWithDot(key));

			return <React.Fragment key={key}>
				<Header dividing>{`Crawl ${level}`}</Header>
				<Checkbox checked={dynamic} label="Dynamic" name={`${key}.dynamic`}/>
				<ScrapeExpressionBuilder
					parentPath={key}
					name='urlExpression'
					optgroups={URL_OPTGROUPS}
				/>
				<Scrape
					fields={fields}
					parentPath={key}
					value={scrape}
				/>
				{/*<Download
					parentPath={key}
					tags={tags}
					value={download}
				/>*/}
				<Crawl
					fields={fields}
					parentPath={key}
					value={crawl}
				/>{/*Recursive*/}
				<Buttons>
					<InsertButton index={index} path={path} text={`Add crawl ${level.replace(/(\d+)$/, (match, digits) => parseInt(digits) + 1)}`} value={{dynamic: false, urlExpr: ''}}/>
					<RemoveButton index={index} path={path} text={`Remove crawl ${level}`}/>
					<MoveDownButton disabled={index === value.length-1} index={index} path={path} text={`Move crawl ${level} down`} visible={value.length > 1}/>
					<MoveUpButton index={index} path={path} text={`Move crawl ${level} up`} visible={value.length > 1}/>
				</Buttons>
			</React.Fragment>
		})}
	/>;
});

/*
When no crawl:
[Add crawl]

When:
	1

Then:
[Add crawl 1.1]

[Remove crawl 1]
[Add crawl 2]
*/
