import {getIn} from 'formik';

import {Fieldset} from '../elements/Fieldset';
import {Select} from '../elements/Select';

import {Fulltext} from './Fulltext';
import {QueryGroup} from './QueryGroup';

//import {toStr} from '../utils/toStr';


export const ExpressionSelector = ({
	fields,
	name = 'query',
	legend = null,
	parentPath,
	path = parentPath ? `${parentPath}.${name}` : name,
	setFieldValue,
	values,
	value = values && getIn(values, path) || {
		type: 'fulltext',
		params: {
			fields: [{
				field: '',
				boost: ''
			}],
			operator: 'or'
		}
	}
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
				setFieldValue(paramsPath, newType === 'group'
					? {
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
					: {
						fields: [{
							field: '',
							boost: ''
						}],
						operator: 'or'
					}
				);
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
