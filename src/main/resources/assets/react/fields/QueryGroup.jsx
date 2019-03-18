import {connect, FieldArray, getIn} from 'formik';
import generateUuidv4 from 'uuid/v4';

import {InsertButton} from '../buttons/InsertButton';
import {MoveUpButton} from '../buttons/MoveUpButton';
import {MoveDownButton} from '../buttons/MoveDownButton';
import {RemoveButton} from '../buttons/RemoveButton';

import {Fieldset} from '../elements/Fieldset';
import {Radio} from '../elements/Radio';

import {OperatorSelector} from './OperatorSelector';
import {ExpressionSelector} from './ExpressionSelector';

//import {toStr} from '../utils/toStr';


export const QueryGroup = connect(({
	formik: {
		values
	},
	fields,
	name = 'group',
	legend = null,
	parentPath,
	path = parentPath ? `${parentPath}.${name}` : name,
	value = values && getIn(values, path) || {
		expressions: [{
			type: 'fulltext',
			params: {
				fields: [{
					field: '',
					boost: ''
				}],
				operator: 'or'
			}
		}],
		operator: 'or'
	}
}) => {
	/*console.debug(toStr({
		//fields,
		parentPath, path,
		//values,
		value
	}));*/
	const fragment = <>
		<OperatorSelector
			parentPath={path}
		/>
		<Fieldset legend={`Expression${value.expressions.length > 1 ? 's' : ''}`}>
			<FieldArray
				name={`${path}.expressions`}
				render={() => value.expressions.map(({uuid4}, index) => {
					const expressionPath = `${path}.expressions[${index}]`;
					return <div key={uuid4}>
						<ExpressionSelector
							fields={fields}
							path={expressionPath}
						/>
						<InsertButton
							index={index}
							path={path}
							text={`${index === (value.expressions.length - 1) ? 'Add' : 'Insert'} expression`}
							value={{
								type: 'fulltext',
								params: {
									fields: [{
										field: '',
										boost: ''
									}],
									operator: 'or'
								},
								uuid4: generateUuidv4()
							}}
						/>
						<RemoveButton index={index} path={path} text="Remove expression" visible={value.expressions.length > 1}/>
						<MoveDownButton disabled={index === value.expressions.length-1} index={index} path={path} visible={value.expressions.length > 1}/>
						<MoveUpButton index={index} path={path} visible={value.expressions.length > 1}/>
						<br />
					</div>;
				})}
			/>
		</Fieldset>
	</>;
	return legend ? <Fieldset legend={legend}>{fragment}</Fieldset> : fragment;
}); // QueryGroup
