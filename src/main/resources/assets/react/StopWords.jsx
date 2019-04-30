import {FieldArray, Formik} from 'formik';

import {
	 Button, Form, Header, Icon
} from 'semantic-ui-react'

import {InsertButton} from './buttons/InsertButton';
import {MoveUpButton} from './buttons/MoveUpButton';
import {MoveDownButton} from './buttons/MoveDownButton';
import {RemoveButton} from './buttons/RemoveButton';
import {SetButton} from './buttons/SetButton';

import {TextInput} from './formik/TextInput';

import {SubmitButton} from './semantic-ui/SubmitButton';

import {toStr} from './utils/toStr';


export const StopWords = ({
	action,
	initialValues,
	mode
}) => {
	return <Formik
		initialValues={initialValues}
		render={({
			values
		}) => {
			console.debug(toStr({values}));
			const words = values.words || [];
			return <Form
				action={action}
				autoComplete="off"
				className='ui form'
				method="POST"
				onSubmit={() => {
					document.getElementById('json').setAttribute('value', JSON.stringify(values))
				}}
				style={{
					width: '100%'
				}}
			>
				<TextInput
					label="Name"
					name="name"
					readOnly={mode === 'edit'}
				/>
				<Header as='h2'>Stop words</Header>
				{words.length
					? <FieldArray
						name='words'
						render={() => words.map((word, index) => {
							const key = `words[${index}]`;
							return <Form.Group key={key}>
								<Form.Field>
									<TextInput path={key}/>
								</Form.Field>
								<Form.Field>
									<Button.Group icon>
										<InsertButton
											index={index}
											path='words'
											value={''}
										/>
										<RemoveButton
											index={index}
											path='words'
											visible={words.length > 1}
										/>
										<MoveDownButton
											disabled={index === words.length-1}
											index={index}
											path='words'
											visible={words.length > 1}
										/>
										<MoveUpButton
											index={index}
											path='words'
											visible={words.length > 1}
										/>
									</Button.Group>
								</Form.Field>
							</Form.Group>;
						})}
					/>
					: <SetButton field='words' value={['']}><Icon color='green' name='plus'/> Add stop word</SetButton>}
				<SubmitButton className='primary' text={mode === 'edit' ? `Update stop words list ${initialValues.name}`: 'Create stop words list'}/>
				<input id="json" name="json" type="hidden"/>
			</Form>;
		}}
	/>;
};
