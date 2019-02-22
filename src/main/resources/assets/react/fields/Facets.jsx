import {FieldArray, getIn} from 'formik';
import generateUuidv4 from 'uuid/v4';


import {InsertButton} from '../buttons/InsertButton';
import {MoveUpButton} from '../buttons/MoveUpButton';
import {MoveDownButton} from '../buttons/MoveDownButton';
import {RemoveButton} from '../buttons/RemoveButton';
import {SetFieldValueButton} from '../buttons/SetFieldValueButton';

import {Fieldset} from '../elements/Fieldset';

import {TagSelector} from './TagSelector';

import {isSet} from '../utils/isSet';
//import {toStr} from '../utils/toStr';


export const Facets = ({
	legend = null,
	level = 0,
	levels = 2,
	name = 'facets',
	parentPath,
	path = parentPath ? `${parentPath}.${name}` : name,
	//phrases,
	setFieldValue,
	tags,
	values,
	value = values && getIn(values, path) || []
}) => {
	if (!(Array.isArray(value) && value.length)) {
		return <SetFieldValueButton
			className='block'
			field={path}
			setFieldValue={setFieldValue}
			text="Add facet(s)"
			value={[{
				tag: '',
				uuid4: generateUuidv4()
			}]}
		/>;
	}
	level += 1;
	const allowChildren = level === levels;
	//console.debug(toStr({level, levels, allowChildren}));
	const fragment = <>
		<FieldArray
			name={path}
			render={({insert, swap, remove}) => value
				.map(({
					facets,
					tag = '',
					uuid4
				}, index) => {
					//console.debug(toStr({facets, tag, uuid4}));
					const pathWithIndex = `${path}[${index}]`;
					return <div key={uuid4}>
						<TagSelector
							parentPath={pathWithIndex}
							placeholder='Please select a tag'
							setFieldValue={setFieldValue}
							tags={tags}
							values={values}
						/>
						{allowChildren ? null : <Facets
							legend=''
							level={level}
							levels={levels}
							parentPath={pathWithIndex}
							setFieldValue={setFieldValue}
							tags={tags}
							values={values}
						/>}
						<InsertButton index={index} insert={insert} value={{
							tag: '',
							//facets: [],
							uuid4: generateUuidv4() // Might not be needed
						}}/>
						<RemoveButton index={index} remove={remove}/>
						<MoveDownButton disabled={index === value.length-1} index={index} swap={swap} visible={value.length > 1}/>
						<MoveUpButton index={index} swap={swap} visible={value.length > 1}/>
					</div>
				})}
		/>
	</>;
	return isSet(legend) ? <Fieldset legend={legend}>{fragment}</Fieldset> : fragment;
} // Facets
