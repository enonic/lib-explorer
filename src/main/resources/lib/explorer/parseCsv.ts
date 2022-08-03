//import {toStr} from '@enonic/js-utils';
import {csvParseRows} from 'd3-dsv';


export function parseCsv({
	// columns = true means get names from first line, and include all columns with names
	// A Falsy value inside the column array skips the column from the output.
	columns = true,

	csvString,
	start = 0
} :{
	columns? :boolean|Array<string>
	csvString :string
	start :number
}) {
	let columnNames = Array.isArray(columns) ? columns : null;
	return csvParseRows(csvString, (data :Array<string>, i :number) => {
		//log.debug('i:%s data:%s', toStr(i), toStr(data));
		if (!columnNames && columns && i === 0) {
			columnNames = data;
			//log.debug('columnNames:%s', toStr(columnNames));
			return;
		}
		if (i < start) { return; }
		const obj = {};
		for (let j = 0; j < data.length; j += 1) {
			const columnName = columnNames[j];
			if (columnName) {
				obj[`${columnName}`] = data[j];
			}
		}
		//log.debug('obj:%s', toStr(obj));
		return obj;
	}).filter((x)=> x);
} // function parseCsv
