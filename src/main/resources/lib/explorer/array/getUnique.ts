import {uniqueFilter} from '/lib/explorer/array/uniqueFilter'

export const getUnique = <T>(a :Array<T>) => a.filter(uniqueFilter);
