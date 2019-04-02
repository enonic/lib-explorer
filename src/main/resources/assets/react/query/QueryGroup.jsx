import {connect, FieldArray, getIn} from 'formik';
import generateUuidv4 from 'uuid/v4';

import {InsertButton} from '../buttons/InsertButton';
import {MoveUpButton} from '../buttons/MoveUpButton';
import {MoveDownButton} from '../buttons/MoveDownButton';
import {RemoveButton} from '../buttons/RemoveButton';
import {SetButton} from '../buttons/SetButton';

import {Buttons} from '../semantic-ui/Buttons';
import {Field} from '../semantic-ui/Field';
import {Header} from '../semantic-ui/Header';
import {Icon} from '../semantic-ui/Icon';

import {OperatorSelector} from './OperatorSelector';
import {ExpressionSelector} from './ExpressionSelector';

//import {toStr} from '../utils/toStr';


export const QueryGroup = connect(({
	formik: {
		values
	},
	fields,
	name = 'group',
	parentPath,
	path = parentPath ? `${parentPath}.${name}` : name,
	value = values && getIn(values, path)
}) => {
	/*console.debug(toStr({
		component: 'QueryGroup',
		//fields,
		//parentPath,
		//name,
		path,
		value
	}));*/
	const expressionsPath = `${path}.expressions`;
	if (!value || !value.expressions || !Array.isArray(value.expressions) || !value.expressions.length) {
		return <Field>
			<InsertButton
				index={0}
				path={expressionsPath}
				text={'Add expression'}
				value={{
					params: {},
					type: '',
					uuid4: generateUuidv4()
				}}
			/>
		</Field>;
	}
	return <>
		<OperatorSelector
			parentPath={path}
		/>
		<Header dividing>Expression{value.expressions.length > 1 && 's'}</Header>
		<FieldArray
			name={`${path}.expressions`}
			render={() => value.expressions.map(({uuid4}, index) => {
				return <div key={uuid4}>
					<ExpressionSelector
						fields={fields}
						path={`${path}.expressions[${index}]`}
					/>
					<Buttons icon>
						<InsertButton
							index={index}
							path={expressionsPath}
							text={`${index === (value.expressions.length - 1) ? 'Add' : 'Insert'} expression`}
							value={{
								params: {},
								type: '',
								uuid4: generateUuidv4()
							}}
						/>
						<RemoveButton
							index={index}
							path={expressionsPath}
							text="Remove
							expression"
							visible={value.expressions.length > 1}
						/>
						<MoveDownButton
							disabled={index === value.expressions.length-1}
							index={index}
							path={expressionsPath}
							visible={value.expressions.length > 1}
						/>
						<MoveUpButton
							index={index}
							path={expressionsPath}
							visible={value.expressions.length > 1}
						/>
					</Buttons>
				</div>;
			})}
		/>
	</>;
}); // QueryGroup
