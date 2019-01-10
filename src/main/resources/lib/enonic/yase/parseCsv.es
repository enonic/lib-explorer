//import parse from 'csv-parse'; // Buffer.TYPED_ARRAY_SUPPORT problems
//import parse from 'csv-parse/lib/sync'; // Buffer.TYPED_ARRAY_SUPPORT problems
//import parse from 'csv-string'; // Buffer.TYPED_ARRAY_SUPPORT problems
//import csv from 'csvtojson'; // setTimeout is not defined
//import csvdata from 'csvdata'; // Only works with files
//import csv from 'csv-parser'; // Buffer.TYPED_ARRAY_SUPPORT problems
import {csvParseRows} from 'd3-dsv/src/csv';

//import {toStr} from '/lib/enonic/util';


export function parseCsv({
	// columns = true means get names from first line, and include all columns with names
	// A Falsy value inside the column array skips the column from the output.
	columns = true,

	csvString,
	forEach = null,
	map = null,
	start = 0
}) {
	let columnNames = Array.isArray(columns) ? columns : null;
	let records = [];
	csvParseRows(csvString, (data, i) => {
		//log.info(toStr({data, i}));
		if (!columnNames && columns && i === 0) {
			columnNames = data;
			//log.info(toStr({columnNames}));
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
		//log.info(toStr({obj}));
		records.push(obj);
	}); //log.info(toStr({records}));
	if (map) { records = records.map(map); }
	if (forEach) { records.forEach(forEach); }
	return records;
} // function parseCsv
