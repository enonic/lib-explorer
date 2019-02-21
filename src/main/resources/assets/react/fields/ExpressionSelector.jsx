import {FieldArray} from 'formik';
import {get} from 'lodash';

import {Fieldset} from '../elements/Fieldset';
import {Select} from '../elements/Select';

import {
	DEFAULT_FULLTEXT_PARAMS,
	DEFAULT_FULLTEXT_EXPRESSION,
	DEFAULT_GROUP_PARAMS
} from './constants'
import {Fulltext} from './Fulltext';
import {QueryGroup} from './QueryGroup';

//import {toStr} from '../utils/toStr';


export const ExpressionSelector = ({
	defaultValue = DEFAULT_FULLTEXT_EXPRESSION,
	fields,
	name = 'query',
	legend = null,
	parentPath,
	path = parentPath ? `${parentPath}.${name}` : name,
	setFieldValue,
	values,
	value = values ? get(values, path, defaultValue) : defaultValue
}) => {
	const {params, type} = value;
	const selectPath = `${path}.type`;
	const paramsPath = `${path}.params`;
	const fragment = <>
		<Select
			path={selectPath}
			onChange={({
				target: {
					selectedOptions // HTMLCollection
				}
			}) => {
				const htmlCollectionAsArray = [].slice
					.call(selectedOptions)
					.map(({value}) => value);
				const newType = htmlCollectionAsArray[0];
				//console.debug({ selectPath, htmlCollectionAsArray});
				setFieldValue(selectPath, newType);
				setFieldValue(paramsPath, newType === 'group' ? DEFAULT_GROUP_PARAMS : DEFAULT_FULLTEXT_PARAMS);
			}}
			options={[{
				label: 'Group',
				value: 'group'
			}, {
				label: 'Fulltext',
				value: 'fulltext'
			}, {
				label: 'Ngram',
				value: 'ngram'
			}]}
			value={type}
		/>
		{['fulltext', 'ngram'].includes(type)
			? <Fulltext
				fields={fields}
				name={type}
				path={paramsPath}
				setFieldValue={setFieldValue}
				values={values}
			/>
			: null
		}
		{type === 'group'
			? <QueryGroup
				fields={fields}
				path={paramsPath}
				setFieldValue={setFieldValue}
				values={values}
			/>
			: null
		}
	</>;
	return legend ? <Fieldset legend={legend}>{fragment}</Fieldset> : fragment;
}
