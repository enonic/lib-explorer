import {FieldArray} from 'formik';
import {get} from 'lodash';

import {InsertButton} from '../buttons/InsertButton';
import {MoveUpButton} from '../buttons/MoveUpButton';
import {MoveDownButton} from '../buttons/MoveDownButton';
import {RemoveButton} from '../buttons/RemoveButton';

import {Fieldset} from '../elements/Fieldset';
import {Radio} from '../elements/Radio';
import {Table} from '../elements/Table';

import {
	DEFAULT_FULLTEXT_EXPRESSION,
	DEFAULT_GROUP_PARAMS
} from './constants'
import {OperatorSelector} from './OperatorSelector';
import {ExpressionSelector} from './ExpressionSelector';

//import {toStr} from '../utils/toStr';


export const QueryGroup = ({
	defaultValue = DEFAULT_GROUP_PARAMS,
	fields,
	name = 'group',
	legend = null,
	parentPath,
	path = parentPath ? `${parentPath}.${name}` : name,
	setFieldValue,
	values,
	value = values ? get(values, path, defaultValue) : defaultValue
}) => {
	/*console.debug(toStr({
		//defaultValue,
		//fields,
		parentPath, path,
		//values,
		value
	}));*/
	const fragment = <>
		<OperatorSelector
			parentPath={path}
			setFieldValue={setFieldValue}
			values={values}
		/>
		<Fieldset legend={`Expression${value.expressions.length > 1 ? 's' : ''}`}>
			<FieldArray
				name={`${path}.expressions`}
				render={({insert, swap, remove}) => value.expressions.map((expression, index) => {
					const key = `${path}.expressions[${index}]`;
					return <React.Fragment key={key}>
						<ExpressionSelector
							fields={fields}
							path={key}
							setFieldValue={setFieldValue}
							values={values}
						/>
						<InsertButton index={index} insert={insert} text={`${index === (value.expressions.length - 1) ? 'Add' : 'Insert'} expression`} value={DEFAULT_FULLTEXT_EXPRESSION}/>
						<RemoveButton index={index} remove={remove} text="Remove expression" visible={value.expressions.length > 1}/>
						<MoveDownButton disabled={index === value.expressions.length-1} index={index} swap={swap} visible={value.expressions.length > 1}/>
						<MoveUpButton index={index} swap={swap} visible={value.expressions.length > 1}/>
						<br />
					</React.Fragment>;
				})}
			/>
		</Fieldset>
	</>;
	return legend ? <Fieldset legend={legend}>{fragment}</Fieldset> : fragment;
} // QueryGroup
