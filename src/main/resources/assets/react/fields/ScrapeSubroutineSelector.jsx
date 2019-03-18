import {getIn} from 'formik';
import {Select} from '../elements/Select';

import {SCRAPE_SUBROUTINES} from './scrapeSubroutineConstants';

//import {toStr} from '../utils/toStr';


export const ScrapeSubroutineSelector = ({
	name = 'subroutine',
	parentPath,
	path = parentPath ? `${parentPath}.${name}` : name,
	optgroups = SCRAPE_OPTGROUPS,
	values,
	value = getIn(values, path) || undefined,
	...rest
}) => {
	//console.debug(toStr({path, value}));
	return <Select
		path={path}
		optgroups={optgroups}
		value={value}
		{...rest}
	/>;
} // ScrapeSubroutineSelector
