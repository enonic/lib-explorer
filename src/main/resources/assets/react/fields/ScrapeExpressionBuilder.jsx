import {Field, FieldArray, getIn} from 'formik';

import {InsertButton} from '../buttons/InsertButton';
import {MoveUpButton} from '../buttons/MoveUpButton';
import {MoveDownButton} from '../buttons/MoveDownButton';
import {RemoveButton} from '../buttons/RemoveButton';
import {SetFieldValueButton} from '../buttons/SetFieldValueButton';

import {Table} from '../elements/Table';

import {ScrapeQuantifierSelector} from './ScrapeQuantifierSelector';
import {ScrapeSubroutineSelector} from './ScrapeSubroutineSelector';

//import {toStr} from '../utils/toStr';
const tdStyle = {
	border: '0 none',
	padding: '0 5px 0 0'
};

export const ScrapeExpressionBuilder = ({
	name = 'scrapeExpression',
	parentPath,
	path = parentPath ? `${parentPath}.${name}` : name,
	setFieldValue,
	values,
	value = getIn(values, path) || [{subroutine: ''}]
}) => {
	//console.debug(toStr({path, value}))
	if(!(value && Array.isArray(value) && value.length)) {
		return <SetFieldValueButton
			className='block'
			field={path}
			value={[{subroutine: ''}]}
			setFieldValue={setFieldValue}
			text="Add scrape expression"/>
	}
	return <Table><FieldArray
		name={path}
		render={() => value.map(({
			attribute = '',
			quantifier = '',
			property = '',
			selector = '',
			subroutine = ''
		}, index) => {
			const key = `${path}[${index}]`;
			//console.debug(toStr({key}));
			return <tr key={key}>
				<td style={tdStyle}><ScrapeSubroutineSelector
					parentPath={key}
					placeholder='Select subroutine'
					setFieldValue={setFieldValue}
					value={subroutine}
				/></td>
				<td style={tdStyle}>
					{['select', 'remove', 'x'].includes(subroutine) ? <Field
						autoComplete="off"
						name={`${key}.selector`}
						value={selector}
					/> : null}
					{subroutine === 'read attribute' ?<Field
						autoComplete="off"
						name={`${key}.attribute`}
						value={attribute}
					/> : null}
					{subroutine === 'read property' ?<Field
						autoComplete="off"
						name={`${key}.property`}
						value={property}
					/> : null}
				</td>
				<td style={tdStyle}>
					{['select', 'remove', 'x'].includes(subroutine) ? <ScrapeQuantifierSelector
						parentPath={key}
						placeholder='Select quantifier'
						setFieldValue={setFieldValue}
						value={quantifier}
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
