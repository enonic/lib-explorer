//import {toStr} from '/lib/util';

import {ucFirst} from '/lib/enonic/yase/ucFirst';
import {create} from '/lib/enonic/yase/node/create';
import {modify} from '/lib/enonic/yase/node/modify';


export class Node {
	constructor({
		//__connection,
		_parentPath = '/',
		_name = '', //throw new Error('_name is a required parameter'),
		_indexConfig = {
			//analyzer: 'document_index_default',
			default: 'byType'
		},
		displayName = ucFirst(_name),
		...rest
	}) {
		//log.info(toStr({_parentPath, _name, _indexConfig, displayName, rest}));
		if (!_name) {
			throw new Error('_name is a required parameter');
		}
		/*if (!_indexConfig.analyzer) {
			_indexConfig.analyzer = 'document_index_default';
		}*/
		this.node = {
			_parentPath,
			_name,
			_indexConfig,
			displayName,
			...rest
		};
		//log.info(toStr({node: this.node}));
	} // constructor


	create({
		connection = this.node.__connection // eslint-disable-line no-underscore-dangle
	} = {}) {
		//log.info(toStr({node: this.node}));
		const merged = {...this.node, ...{__connection: connection}};
		//log.info(toStr({merged}));
		return create(merged);
	} // create


	modify({
		connection = this.node.__connection // eslint-disable-line no-underscore-dangle
	} = {}) {
		//log.info(toStr({node: this.node}));
		const merged = {...this.node, ...{__connection: connection}};
		//log.info(toStr({merged}));
		return modify(merged);
	} // modify
} // class Node
