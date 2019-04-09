import {connect, getIn} from 'formik';
import generateUuidv4 from 'uuid/v4';

import {InsertButton} from '../buttons/InsertButton';
import {MoveUpButton} from '../buttons/MoveUpButton';
import {MoveDownButton} from '../buttons/MoveDownButton';
import {RemoveButton} from '../buttons/RemoveButton';

import {Dropdown} from '../semantic-ui/react/formik/Dropdown';

import {Buttons} from '../semantic-ui/Buttons';
import {Header} from '../semantic-ui/Header';
import {Segment} from '../semantic-ui/Segment';
import {Segments} from '../semantic-ui/Segments';


import {Fulltext} from './Fulltext';
import {QueryGroup} from './QueryGroup';
import {CompareExpression} from './CompareExpression';
import {PathMatch} from './PathMatch';
import {Range} from './Range';

//import {toStr} from '../utils/toStr';


export const ExpressionSelector = connect(({
	formik: {
		setFieldValue,
		values
	},
	expressions = [],
	fields,
	name = 'query',
	legend = null,
	parentPath,
	path = parentPath ? `${parentPath}.${name}` : name,
	thesauriOptions,
	value = values && getIn(values, path)
}) => {
	/*console.debug(toStr({
		component: 'ExpressionSelector',
		//parentPath,
		//name,
		path,
		value,
		thesauriOptions
	}));*/
	const {params = {}, type = ''} = value;
	const paramsPath = `${path}.params`;
	const selectPath = `${path}.type`;
	return <>
		{legend ? <Header dividing text={legend}/> : null}
		<Segments raised>
			<Segment>
				<Dropdown
					path={selectPath}
					onChange={(event, {value: newType}) => {
						console.debug({event, newType});
						setFieldValue(selectPath, newType);
						if(newType === 'group') {
							setFieldValue(paramsPath, {
								expressions: [],
								operator: 'or'
							});
						} else if (['fulltext', 'ngram', 'synonyms'].includes(newType)) {
							setFieldValue(paramsPath, {
								fields: [{
									field: '_allText',
									boost: '',
									uuid4: generateUuidv4()
								}],
								operator: newType === 'synonyms' ? 'or' : 'and',
								//searchString: newType === 'synonyms' ? 'synonyms' : 'searchString',
								thesauri: newType === 'synonyms' ? [] : undefined
							});
						} else if (newType === 'compareExpr') {
							setFieldValue(paramsPath, {
								field: '',
								operator: '=',
								valueExpr: ''
							});
						} else if (newType === 'range') {
							setFieldValue(paramsPath, {
								field: '',
								from : '',
								to: '',
								includeFrom: false,
								includeTo: false
							});
						} else if (newType === 'pathMatch') {
							setFieldValue(paramsPath, {
								field: '',
								path: '',
								minMatch: 1
							});
						}
					}}
					options={[{
						key: 'group',
						text: 'Logic',
						value: 'group'
					}, {
						key: 'fulltext',
						text: 'Fulltext',
						value: 'fulltext'
					}, {
						key: 'ngram',
						text: 'Ngram',
						value: 'ngram'
					}, {
						key: 'synonyms',
						text: 'Synonyms', // Fulltext Or
						value: 'synonyms'
					}, {
						key: 'compareExpr',
						text: 'Compare expression',
						value: 'compareExpr'
					}, {
						key: 'range',
						text: 'Range',
						value: 'range'
					}, {
						key: 'pathMatch',
						text: 'Path match',
						value: 'pathMatch'
					}]}
					placeholder='Please select expression type'
					value={type}
				/>
				{['fulltext', 'ngram', 'synonyms'].includes(type)
					? <Fulltext
						fields={fields}
						path={paramsPath}
						type={type}
						thesauriOptions={thesauriOptions}
					/>
					: null
				}
				{type === 'group'
					? <QueryGroup
						fields={fields}
						path={paramsPath}
						thesauriOptions={thesauriOptions}
					/>
					: null
				}
				{type === 'compareExpr'
					? <CompareExpression
						fields={fields}
						path={paramsPath}
					/>
					: null
				}
				{type === 'range'
					? <Range
						fields={fields}
						path={paramsPath}
					/>
					: null
				}
				{type === 'pathMatch'
					? <PathMatch
						fields={fields}
						path={paramsPath}
					/>
					: null
				}
				{parentPath ? <Buttons>
					<RemoveButton
						index={name}
						path={parentPath}
						text={`Remove ${type}`}
					/>
					<MoveDownButton
						disabled={name === expressions.length-1}
						index={name}
						path={parentPath}
						visible={expressions.length > 1}
					/>
					<MoveUpButton
						index={name}
						path={parentPath}
						visible={expressions.length > 1}
					/>
				</Buttons>: null}
			</Segment>
		</Segments>
	</>;
});
