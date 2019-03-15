import {Field, FieldArray, getIn} from 'formik';

import {InsertButton} from '../buttons/InsertButton';
import {MoveUpButton} from '../buttons/MoveUpButton';
import {MoveDownButton} from '../buttons/MoveDownButton';
import {RemoveButton} from '../buttons/RemoveButton';
import {SetFieldValueButton} from '../buttons/SetFieldValueButton';

import {Table} from '../elements/Table';

import {ScrapeQuantifierSelector} from './ScrapeQuantifierSelector';

import {SCRAPE_OPTGROUPS} from './scrapeSubroutineConstants';
import {ScrapeSubroutineSelector} from './ScrapeSubroutineSelector';

//import {toStr} from '../utils/toStr';
const tdStyle = {
	border: '0 none',
	padding: '0 5px 0 0'
};

export const ScrapeExpressionBuilder = ({
	headers,// = ['Subroutine', 'Selector/Attribute/Property', 'Quantifier', 'Node index', 'Actions'],
	name = 'scrapeExpression',
	parentPath,
	path = parentPath ? `${parentPath}.${name}` : name,
	setFieldValue,
	optgroups = SCRAPE_OPTGROUPS,
	values,
	value = getIn(values, path) || [{subroutine: ''}]
}) => {
	//console.debug(toStr({path, value}))
	if(!(value && Array.isArray(value) && value.length)) {
		return <SetFieldValueButton
			className='block'
			field={path}
			value={[{
				subroutine: ''
			}]}
			setFieldValue={setFieldValue}
			text="Add scrape expression"/>
	}
	return <Table headers={headers} thStyle={tdStyle}><FieldArray
		name={path}
		render={() => value.map(({
			attribute = '',
			nodeIndex = '',
			property = '',
			quantifier = '{0,}',
			selector = '',
			subroutine = ''
		}, index) => {
			const key = `${path}[${index}]`;
			//console.debug(toStr({key}));
			return <tr key={key}>
				<td style={tdStyle}><ScrapeSubroutineSelector
					optgroups={optgroups}
					parentPath={key}
					placeholder='Select subroutine'
					setFieldValue={setFieldValue}
					value={subroutine}
				/></td>
				<td style={tdStyle}>
					{['remove', 'rmx', 'select', 'sl', 'slx', 'sx'].includes(subroutine) ? <Field
						autoComplete="off"
						name={`${key}.selector`}
						placeholder={['remove', 'select', 'sl'].includes(subroutine) ? 'Css selector' : 'Xpath selector'}
						value={selector}
					/> : null}
					{subroutine === 'read attribute' ?<Field
						autoComplete="off"
						name={`${key}.attribute`}
						placeholder='attribute'
						value={attribute}
					/> : null}
					{subroutine === 'read property' ?<Field
						autoComplete="off"
						name={`${key}.property`}
						placeholder='property'
						value={property}
					/> : null}
				</td>
				<td style={tdStyle}>
					{['remove', 'rmx', 'select', 'sx'].includes(subroutine) ? <ScrapeQuantifierSelector
						parentPath={key}
						placeholder='Select quantifier'
						setFieldValue={setFieldValue}
						value={quantifier}
					/> : null}
				</td>
				<td style={tdStyle}>
					{['remove', 'rmx', 'select', 'sl', 'slx', 'sx'].includes(subroutine) ? <Field
						autoComplete="off"
						name={`${key}.nodeIndex`}
						placeholder='Node index'
						type='number'
						value={nodeIndex}
					/> : null}
				</td>
				{subroutine ? <td style={tdStyle}>
					<InsertButton
						index={index}
						path={path}
						setFieldValue={setFieldValue}
						values={values}
						value={{subroutine: ''}}
					/>
					<RemoveButton
						index={index}
						path={path}
						setFieldValue={setFieldValue}
						values={values}
					/>
					<MoveDownButton
						disabled={index === value.length-1}
						index={index}
						path={path}
						setFieldValue={setFieldValue}
						values={values}
						visible={value.length > 1}
					/>
					<MoveUpButton
						index={index}
						path={path}
						setFieldValue={setFieldValue}
						values={values}
						visible={value.length > 1}
					/>
				</td> : null}
			</tr>;
		})}
	/></Table>;
} // ScrapeExpressionBuilder
