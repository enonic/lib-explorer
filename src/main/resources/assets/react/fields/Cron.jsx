import {connect, getIn} from 'formik';

import {TextInput} from '../formik/TextInput';
import {Select} from '../elements/Select';

import {Fields} from '../semantic-ui/Fields';
import {Field} from '../semantic-ui/Field';
import {Header} from '../semantic-ui/Header';
import {Label} from '../semantic-ui/Label';


export const Cron = connect(({
	formik: {
		values
	},
	parentPath,
	name = 'cron',
	path = parentPath ? `${parentPath}.${name}` : name,
	value = getIn(values, path, {
		minute: '*',
		hour: '*',
		dayOfMonth: '*',
		month: '*',
		dayOfWeek: '*'
	})
}) => {
	const {
		minute = '*', // 0-59
		hour = '*', // 0-23
		dayOfMonth = '*', // 1-31
		month = '*', // 1-12
		dayOfWeek = '*' // 0-6 Sunday to Saturday 7 is also Sunday on some systems
	} = value;
	return <>
		<Header h2 dividing text='Cron' id='cron'/>
		<Fields inline>
			<Field>
				<Label text='Minute'/>
				<TextInput
					name='minute'
					parentPath={path}
					value={minute}
				/>
			</Field>
			<Field>
				<Label text='Hour'/>
				<Select
					name='hour'
					parentPath={path}
					options={HOUR_OPTIONS}
					value={hour}
				/>
			</Field>
			<Field>
				<Label text='Day of month'/>
				<Select
					name='dayOfMonth'
					parentPath={path}
					options={DAY_OF_MONTH_OPTIONS}
					value={dayOfMonth}
				/>
			</Field>
			<Field>
				<Label text='Month'/>
				<Select
					name='month'
					parentPath={path}
					options={MONTH_OPTIONS}
					value={month}
				/>
			</Field>
			<Field>
				<Label text='Day of week'/>
				<Select
					name='dayOfWeek'
					parentPath={path}
					options={DAY_OF_WEEK_OPTIONS}
					value={dayOfWeek}
				/>
			</Field>
		</Fields>
	</>;
}) // Cron


const HOUR_OPTIONS = [{
	value: '*'
},{
	value: '0'
},{
	value: '1'
},{
	value: '2'
},{
	value: '3'
},{
	value: '4'
},{
	value: '5'
},{
	value: '6'
},{
	value: '7'
},{
	value: '8'
},{
	value: '9'
},{
	value: '10'
},{
	value: '11'
},{
	value: '12'
},{
	value: '13'
},{
	value: '14'
},{
	value: '15'
},{
	value: '16'
},{
	value: '17'
},{
	value: '18'
},{
	value: '19'
},{
	value: '20'
},{
	value: '21'
},{
	value: '22'
},{
	value: '23'
}];

const DAY_OF_MONTH_OPTIONS = [{
	value: '*'
},{
	value: '0'
},{
	value: '1'
},{
	value: '2'
},{
	value: '3'
},{
	value: '4'
},{
	value: '5'
},{
	value: '6'
},{
	value: '7'
},{
	value: '8'
},{
	value: '9'
},{
	value: '10'
},{
	value: '11'
},{
	value: '12'
},{
	value: '13'
},{
	value: '14'
},{
	value: '15'
},{
	value: '16'
},{
	value: '17'
},{
	value: '18'
},{
	value: '19'
},{
	value: '20'
},{
	value: '21'
},{
	value: '22'
},{
	value: '23'
},{
	value: '24'
},{
	value: '25'
},{
	value: '26'
},{
	value: '27'
},{
	value: '28'
},{
	value: '29'
},{
	value: '30'
},{
	value: '31'
}];


const MONTH_OPTIONS = [{
	value: '*'
},{
	label: 'January',
	value: '1'
},{
	label: 'February',
	value: '2'
},{
	label: 'March',
	value: '3'
},{
	label: 'April',
	value: '4'
},{
	label: 'May',
	value: '5'
},{
	label: 'June',
	value: '6'
},{
	label: 'July',
	value: '7'
},{
	label: 'August',
	value: '8'
},{
	label: 'September',
	value: '9'
},{
	label: 'October',
	value: '10'
},{
	label: 'November',
	value: '11'
},{
	label: 'December',
	value: '12'
}];

const DAY_OF_WEEK_OPTIONS = [{
	value: '*'
},{
	label: 'Sunday',
	value: '0'
},{
	label: 'Monday',
	value: '1'
},{
	label: 'Tuesday',
	value: '2'
},{
	label: 'Wednesday',
	value: '3'
},{
	label: 'Thursday',
	value: '4'
},{
	label: 'Friday',
	value: '5'
},{
	label: 'Saturday',
	value: '6'
}];
