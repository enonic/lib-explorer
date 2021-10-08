import {forceArray} from '@enonic/js-utils';


export const coerseInterfaceType = ({
	_id,
	_name,
	_nodeType,
	_path,
	_versionKey,
	collectionIds = [],
	fields = [],
	stopWordIds = [],
	synonymIds = []
}) => ({
	_id,
	_name,
	_nodeType,
	_path,
	_versionKey,
	collectionIds: forceArray(collectionIds),
	fields: forceArray(fields),
	stopWordIds: forceArray(stopWordIds),
	synonymIds: forceArray(synonymIds)
});
