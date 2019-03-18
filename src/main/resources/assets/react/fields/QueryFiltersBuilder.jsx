import {connect, getIn} from 'formik';

//import {toStr} from '../utils/toStr';

import {QueryFilterClause} from './QueryFilterClause';


export const QueryFiltersBuilder = connect(({
	fields = [],
	formik: {values},
	parentPath,
	name = 'filters',
	path = parentPath ? `${parentPath}.${name}` : name,
	value = getIn(values, path) || {}
}) => {
	//console.debug(toStr({parentPath, name, path, value}));
	return <>
		<QueryFilterClause fields={fields} name='must' parentPath={path}/>
		<QueryFilterClause fields={fields} name='mustNot' parentPath={path}/>
	</>
});
